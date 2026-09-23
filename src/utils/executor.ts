export interface ExecutionResult {
  output: string;
  error: string | null;
  success: boolean;
}

// Simulated PostgreSQL database
class SimulatedDatabase {
  private tables: Map<string, any[]> = new Map();
  private queryLog: string[] = [];

  constructor() {
    // Pre-populate with sample data
    this.tables.set('users', [
      { id: 1, email: 'alice@example.com', name: 'Alice', password_hash: '$2b$10$hashed', role: 'admin' },
      { id: 2, email: 'bob@example.com', name: 'Bob', password_hash: '$2b$10$hashed2', role: 'user' },
      { id: 3, email: 'charlie@example.com', name: 'Charlie', password_hash: '$2b$10$hashed3', role: 'user' },
    ]);
    this.tables.set('posts', [
      { id: 1, user_id: 1, title: 'Hello World', content: 'First post', created_at: '2024-01-01' },
      { id: 2, user_id: 2, title: 'Node.js Tips', content: 'Use async/await', created_at: '2024-01-02' },
    ]);
  }

  query(sql: string): any {
    this.queryLog.push(sql);
    const normalized = sql.toLowerCase().trim();

    // SELECT
    if (normalized.startsWith('select')) {
      return this.handleSelect(normalized);
    }
    // INSERT
    if (normalized.startsWith('insert')) {
      return this.handleInsert(normalized, sql);
    }
    // UPDATE
    if (normalized.startsWith('update')) {
      return this.handleUpdate(normalized, sql);
    }
    // DELETE
    if (normalized.startsWith('delete')) {
      return this.handleDelete(normalized);
    }
    // CREATE TABLE
    if (normalized.startsWith('create table')) {
      const match = normalized.match(/create table\s+(\w+)/);
      if (match) {
        if (!this.tables.has(match[1])) {
          this.tables.set(match[1], []);
        }
        return { rows: [], rowCount: 0 };
      }
    }

    return { rows: [], rowCount: 0 };
  }

  private handleSelect(sql: string): any {
    // Extract table name
    const fromMatch = sql.match(/from\s+(\w+)/);
    if (!fromMatch) return { rows: [], rowCount: 0 };
    const tableName = fromMatch[1];
    const table = this.tables.get(tableName) || [];

    let rows = [...table];

    // WHERE clause
    const whereMatch = sql.match(/where\s+(.+?)(?:order|limit|$)/i);
    if (whereMatch) {
      const conditions = whereMatch[1].trim();
      rows = rows.filter(row => this.evaluateWhere(row, conditions));
    }

    // SELECT columns
    const selectMatch = sql.match(/select\s+(.+?)\s+from/i);
    if (selectMatch && selectMatch[1].trim() !== '*') {
      const cols = selectMatch[1].split(',').map(c => c.trim());
      rows = rows.map(row => {
        const filtered: any = {};
        cols.forEach(col => {
          if (row[col] !== undefined) filtered[col] = row[col];
        });
        return filtered;
      });
    }

    // ORDER BY
    const orderMatch = sql.match(/order by\s+(\w+)(?:\s+(asc|desc))?/i);
    if (orderMatch) {
      const col = orderMatch[1];
      const dir = (orderMatch[2] || 'asc').toLowerCase();
      rows.sort((a, b) => {
        if (dir === 'desc') return a[col] > b[col] ? -1 : 1;
        return a[col] > b[col] ? 1 : -1;
      });
    }

    // LIMIT
    const limitMatch = sql.match(/limit\s+(\d+)/i);
    if (limitMatch) {
      rows = rows.slice(0, parseInt(limitMatch[1]));
    }

    return { rows, rowCount: rows.length };
  }

  private handleInsert(sql: string, originalSql: string): any {
    const intoMatch = sql.match(/into\s+(\w+)/);
    if (!intoMatch) return { rowCount: 0 };
    const tableName = intoMatch[1];

    // Extract columns
    const colsMatch = originalSql.match(/\(([^)]+)\)\s*values/i);
    const valsMatch = originalSql.match(/values\s*\(([^)]+)\)/i);

    if (!colsMatch || !valsMatch) return { rowCount: 0 };

    const cols = colsMatch[1].split(',').map(c => c.trim());
    const vals = valsMatch[1].split(',').map(v => {
      const trimmed = v.trim();
      if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        return trimmed.slice(1, -1);
      }
      if (!isNaN(Number(trimmed))) return Number(trimmed);
      return trimmed;
    });

    const row: any = {};
    cols.forEach((col, i) => {
      row[col] = vals[i];
    });

    // Auto-increment id
    const table = this.tables.get(tableName) || [];
    if (!row.id) {
      row.id = table.length > 0 ? Math.max(...table.map(r => r.id || 0)) + 1 : 1;
    }

    table.push(row);
    this.tables.set(tableName, table);

    return { rows: [row], rowCount: 1 };
  }

  private handleUpdate(sql: string, originalSql: string): any {
    const tableMatch = sql.match(/update\s+(\w+)/);
    if (!tableMatch) return { rowCount: 0 };
    const tableName = tableMatch[1];
    const table = this.tables.get(tableName) || [];

    // SET clause
    const setMatch = originalSql.match(/set\s+(.+?)\s+where/i);
    if (!setMatch) return { rowCount: 0 };

    const sets = setMatch[1].split(',').map(s => {
      const [col, val] = s.split('=').map(x => x.trim());
      let value: any = val;
      if (val.startsWith("'") && val.endsWith("'")) value = val.slice(1, -1);
      else if (!isNaN(Number(val))) value = Number(val);
      return { col, value };
    });

    // WHERE clause
    const whereMatch = originalSql.match(/where\s+(.+)/i);
    let updated = 0;

    table.forEach(row => {
      if (!whereMatch || this.evaluateWhere(row, whereMatch[1])) {
        sets.forEach(({ col, value }) => {
          row[col] = value;
        });
        updated++;
      }
    });

    return { rowCount: updated };
  }

  private handleDelete(sql: string): any {
    const fromMatch = sql.match(/from\s+(\w+)/);
    if (!fromMatch) return { rowCount: 0 };
    const tableName = fromMatch[1];
    const table = this.tables.get(tableName) || [];

    const whereMatch = sql.match(/where\s+(.+)/i);
    const before = table.length;

    if (whereMatch) {
      const filtered = table.filter(row => !this.evaluateWhere(row, whereMatch[1]));
      this.tables.set(tableName, filtered);
      return { rowCount: before - filtered.length };
    } else {
      this.tables.set(tableName, []);
      return { rowCount: before };
    }
  }

  private evaluateWhere(row: any, conditions: string): boolean {
    // Handle AND/OR
    if (conditions.includes(' and ')) {
      return conditions.split(' and ').every(c => this.evaluateWhere(row, c.trim()));
    }
    if (conditions.includes(' or ')) {
      return conditions.split(' or ').some(c => this.evaluateWhere(row, c.trim()));
    }

    // Single condition
    const match = conditions.match(/(\w+)\s*(=|!=|>|<|>=|<=|like)\s*'?([^']*)'?/i);
    if (!match) return true;

    const [, col, op, val] = match;
    const rowVal = row[col];
    const compareVal = isNaN(Number(val)) ? val : Number(val);

    switch (op.toLowerCase()) {
      case '=': return rowVal == compareVal;
      case '!=': return rowVal != compareVal;
      case '>': return rowVal > compareVal;
      case '<': return rowVal < compareVal;
      case '>=': return rowVal >= compareVal;
      case '<=': return rowVal <= compareVal;
      case 'like': return String(rowVal).toLowerCase().includes(String(compareVal).toLowerCase().replace(/%/g, ''));
      default: return true;
    }
  }

  reset() {
    this.tables.clear();
    this.tables.set('users', [
      { id: 1, email: 'alice@example.com', name: 'Alice', password_hash: '$2b$10$hashed', role: 'admin' },
      { id: 2, email: 'bob@example.com', name: 'Bob', password_hash: '$2b$10$hashed2', role: 'user' },
      { id: 3, email: 'charlie@example.com', name: 'Charlie', password_hash: '$2b$10$hashed3', role: 'user' },
    ]);
    this.tables.set('posts', [
      { id: 1, user_id: 1, title: 'Hello World', content: 'First post', created_at: '2024-01-01' },
      { id: 2, user_id: 2, title: 'Node.js Tips', content: 'Use async/await', created_at: '2024-01-02' },
    ]);
  }
}

// Simulated Express app
class SimulatedExpress {
  private routes: Map<string, Map<string, Function>> = new Map();
  private middleware: Function[] = [];

  use(fn: Function) {
    this.middleware.push(fn);
  }

  get(path: string, ...handlers: Function[]) {
    this.addRoute('GET', path, handlers);
  }

  post(path: string, ...handlers: Function[]) {
    this.addRoute('POST', path, handlers);
  }

  put(path: string, ...handlers: Function[]) {
    this.addRoute('PUT', path, handlers);
  }

  delete(path: string, ...handlers: Function[]) {
    this.addRoute('DELETE', path, handlers);
  }

  private addRoute(method: string, path: string, handlers: Function[]) {
    if (!this.routes.has(method)) this.routes.set(method, new Map());
    this.routes.get(method)!.set(path, handlers[handlers.length - 1]);
  }

  async request(method: string, path: string, body?: any, headers?: any): Promise<any> {
    const methodRoutes = this.routes.get(method);
    if (!methodRoutes) return { status: 404, body: { error: 'Not Found' } };

    // Match route with params
    let handler: Function | null = null;
    let params: any = {};

    for (const [pattern, h] of methodRoutes.entries()) {
      const paramNames: string[] = [];
      const regex = pattern.replace(/:(\w+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      });
      const match = path.match(new RegExp(`^${regex}$`));
      if (match) {
        handler = h;
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        break;
      }
    }

    if (!handler) return { status: 404, body: { error: 'Not Found' } };

    const req = { method, path, params, body: body || {}, headers: headers || {}, query: {} };
    const res = {
      _status: 200,
      _body: null,
      status(code: number) { this._status = code; return this; },
      json(data: any) { this._body = data; return this; },
      send(data: any) { this._body = data; return this; },
    };

    try {
      await handler(req, res);
      return { status: res._status, body: res._body };
    } catch (err: any) {
      return { status: 500, body: { error: err.message } };
    }
  }
}

// Simulated JWT
const SimulatedJWT = {
  sign(payload: any, secret: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
    const sig = btoa(secret + body.length);
    return `${header}.${body}.${sig}`;
  },
  verify(token: string, secret: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch {
      throw new Error('Invalid token');
    }
  }
};

// Simulated bcrypt
const SimulatedBcrypt = {
  hash(password: string, rounds: number): string {
    return `$2b$${rounds}$${btoa(password).slice(0, 20)}`;
  },
  compare(password: string, hash: string): boolean {
    const encoded = btoa(password).slice(0, 20);
    return hash.includes(encoded);
  }
};

// Simulated validation (Zod-like)
class SimulatedZod {
  static string() {
    return new ZodString();
  }
  static number() {
    return new ZodNumber();
  }
  static object(shape: any) {
    return new ZodObject(shape);
  }
  static array(schema: any) {
    return new ZodArray(schema);
  }
}

class ZodString {
  private checks: Function[] = [];
  private optional_ = false;

  min(n: number) { this.checks.push((v: string) => v.length >= n || `Must be at least ${n} characters`); return this; }
  max(n: number) { this.checks.push((v: string) => v.length <= n || `Must be at most ${n} characters`); return this; }
  email() { this.checks.push((v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email'); return this; }
  optional() { this.optional_ = true; return this; }

  parse(value: any) {
    if (this.optional_ && value === undefined) return value;
    if (typeof value !== 'string') throw new Error('Expected string');
    for (const check of this.checks) {
      const result = check(value);
      if (result !== true) throw new Error(result);
    }
    return value;
  }

  safeParse(value: any) {
    try {
      return { success: true, data: this.parse(value) };
    } catch (err: any) {
      return { success: false, error: { message: err.message } };
    }
  }
}

class ZodNumber {
  private checks: Function[] = [];
  private optional_ = false;

  min(n: number) { this.checks.push((v: number) => v >= n || `Must be at least ${n}`); return this; }
  max(n: number) { this.checks.push((v: number) => v <= n || `Must be at most ${n}`); return this; }
  int() { this.checks.push((v: number) => Number.isInteger(v) || 'Must be an integer'); return this; }
  positive() { this.checks.push((v: number) => v > 0 || 'Must be positive'); return this; }
  optional() { this.optional_ = true; return this; }

  parse(value: any) {
    if (this.optional_ && value === undefined) return value;
    if (typeof value !== 'number') throw new Error('Expected number');
    for (const check of this.checks) {
      const result = check(value);
      if (result !== true) throw new Error(result);
    }
    return value;
  }

  safeParse(value: any) {
    try {
      return { success: true, data: this.parse(value) };
    } catch (err: any) {
      return { success: false, error: { message: err.message } };
    }
  }
}

class ZodObject {
  private shape: any;
  constructor(shape: any) { this.shape = shape; }

  parse(value: any) {
    if (typeof value !== 'object' || value === null) throw new Error('Expected object');
    const result: any = {};
    for (const key in this.shape) {
      result[key] = this.shape[key].parse(value[key]);
    }
    return result;
  }

  safeParse(value: any) {
    try {
      return { success: true, data: this.parse(value) };
    } catch (err: any) {
      return { success: false, error: { message: err.message } };
    }
  }
}

class ZodArray {
  private schema: any;
  constructor(schema: any) { this.schema = schema; }

  parse(value: any) {
    if (!Array.isArray(value)) throw new Error('Expected array');
    return value.map(v => this.schema.parse(v));
  }
}

// Global database instance
let globalDb = new SimulatedDatabase();

export function executeCode(code: string): ExecutionResult {
  const output: string[] = [];

  const sandboxConsole = {
    log: (...args: any[]) => {
      output.push(args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          try { return JSON.stringify(arg); } catch { return String(arg); }
        }
        return String(arg);
      }).join(' '));
    },
    error: (...args: any[]) => {
      output.push('Error: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    },
    warn: (...args: any[]) => {
      output.push('Warning: ' + args.map(String).join(' '));
    },
    info: (...args: any[]) => {
      output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    }
  };

  // Create mock modules
  const mockModules = {
    express: () => {
      const app = new SimulatedExpress();
      return Object.assign(app, {
        json: () => (req: any, res: any, next: Function) => next(),
        urlencoded: () => (req: any, res: any, next: Function) => next(),
      });
    },
    pg: {
      Pool: class {
        async query(sql: string) {
          return globalDb.query(sql);
        }
      },
      Client: class {
        async connect() {}
        async query(sql: string) {
          return globalDb.query(sql);
        }
        async end() {}
      }
    },
    jsonwebtoken: SimulatedJWT,
    bcrypt: SimulatedBcrypt,
    bcryptjs: SimulatedBcrypt,
    zod: SimulatedZod,
    joi: {
      string: () => ({
        min: (n: number) => ({
          max: (m: number) => ({
            email: () => ({
              required: () => ({ validate: (v: any) => ({ error: null, value: v }) })
            }),
            required: () => ({ validate: (v: any) => ({ error: null, value: v }) })
          }),
          required: () => ({ validate: (v: any) => ({ error: null, value: v }) })
        }),
        email: () => ({ required: () => ({ validate: (v: any) => ({ error: null, value: v }) }) }),
        required: () => ({ validate: (v: any) => ({ error: null, value: v }) })
      }),
      number: () => ({
        min: (n: number) => ({
          max: (m: number) => ({
            required: () => ({ validate: (v: any) => ({ error: null, value: v }) })
          }),
          required: () => ({ validate: (v: any) => ({ error: null, value: v }) })
        }),
        required: () => ({ validate: (v: any) => ({ error: null, value: v }) })
      }),
      object: (shape: any) => ({
        validate: (v: any) => ({ error: null, value: v })
      })
    },
    // Simulated http module
    http: {
      createServer: (handler: Function) => ({
        listen: (port: number, cb?: Function) => {
          output.push(`Server running on port ${port}`);
          if (cb) cb();
        }
      })
    }
  };

  // Reset database before each execution
  globalDb.reset();

  try {
    // Only pass console and require as parameters
    // Users get modules via require() which matches real Node.js behavior
    const fn = new Function(
      'console',
      'require',
      code
    );

    fn(
      sandboxConsole,
      (mod: string) => mockModules[mod as keyof typeof mockModules]
    );

    return {
      output: output.join('\n'),
      error: null,
      success: true
    };
  } catch (err: any) {
    return {
      output: output.join('\n'),
      error: err.message || 'Unknown error',
      success: false
    };
  }
}

export function checkOutput(actual: string, expected: string): boolean {
  const normalize = (s: string) => s.trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  return normalize(actual) === normalize(expected);
}

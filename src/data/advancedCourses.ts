import { Course } from './types';

export const advancedCourses: Course[] = [
  {
    id: 'rest-api',
    title: 'REST API Design',
    description: 'Design and build production-grade REST APIs with proper routing, status codes, and HTTP methods.',
    icon: '🌐',
    color: 'from-blue-500 to-indigo-600',
    lessons: [
      {
        id: 'rest-principles',
        title: 'REST Principles & Status Codes',
        theory: `## REST API Design Principles

REST (Representational State Transfer) is an architectural style for designing networked applications.

### Core Principles
- **Stateless**: Each request contains all information needed
- **Resource-based**: URLs represent resources, not actions
- **HTTP methods**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Status codes**: Communicate result (200, 201, 400, 404, 500)

### Resource Naming
- Use nouns: \`/users\`, \`/posts\`, \`/comments\`
- Plural: \`/users\` not \`/user\`
- Nested: \`/users/123/posts\`
- No verbs: \`GET /users\` not \`GET /getUsers\`

### Status Code Categories
- **2xx**: Success (200 OK, 201 Created, 204 No Content)
- **4xx**: Client error (400 Bad Request, 401 Unauthorized, 404 Not Found)
- **5xx**: Server error (500 Internal Server Error)

According to the [HTTP RFC 7231](https://tools.ietf.org/html/rfc7231), status codes are standardized to ensure consistent behavior across different implementations.`,
        prerequisites: ['Node.js Basics', 'HTTP Fundamentals'],
        spiralConnections: [
          {
            concept: 'HTTP Methods',
            fromLesson: 'Node.js Basics - HTTP Module',
            connection: 'Now using Express routing instead of raw http module'
          }
        ],
        nodeVersion: '20.x LTS',
        furtherReading: [
          {
            title: 'Microsoft REST API Guidelines',
            url: 'https://github.com/microsoft/api-guidelines',
            type: 'docs'
          },
          {
            title: 'Roy Fielding\'s Dissertation on REST',
            url: 'https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm',
            type: 'book'
          },
          {
            title: 'HTTP Status Codes - MDN',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
            type: 'docs'
          }
        ],
        exampleCode: `// RESTful API design
const express = require('express');
const app = express();

// GET all users
app.get('/api/users', (req, res) => {
  res.json({ users: [{ id: 1, name: 'Alice' }] });
});

// GET single user
app.get('/api/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'Alice' };
  res.json(user);
});

// POST create user
app.post('/api/users', (req, res) => {
  const newUser = { id: 2, ...req.body };
  res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  res.status(204).send();
});

console.log('REST API routes defined');
console.log('GET /api/users - List all users');
console.log('POST /api/users - Create user');`,
        exercise: {
          instructions: 'Create a RESTful API with Express. Define routes for a "products" resource: GET /api/products (list all), GET /api/products/:id (get one), POST /api/products (create), DELETE /api/products/:id (delete). Each route should return appropriate status codes.',
          starterCode: `const express = require('express');
const app = express();

// Define your REST routes here

console.log('Products API ready');
`,
          expectedOutput: 'Products API ready',
          solution: `const express = require('express');
const app = express();

app.get('/api/products', (req, res) => {
  res.json({ products: [] });
});

app.get('/api/products/:id', (req, res) => {
  res.json({ id: req.params.id });
});

app.post('/api/products', (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

app.delete('/api/products/:id', (req, res) => {
  res.status(204).send();
});

console.log('Products API ready');`,
          hints: [
            'Think about which HTTP method maps to each operation: reading = GET, creating = POST, deleting = DELETE',
            'Remember that POST should return 201 (Created) and DELETE should return 204 (No Content)',
            'Use app.get(), app.post(), app.delete() methods. Access route parameters with req.params.id'
          ],
          commonMistakes: [
            {
              mistake: 'Using 200 for POST instead of 201',
              hint: 'POST creates a new resource, so it should return 201 Created, not 200 OK'
            },
            {
              mistake: 'Forgetting to handle the :id parameter',
              hint: 'Use req.params.id to access the ID from the URL path'
            }
          ],
          alternativeSolutions: [
            {
              approach: 'Using Express Router for better organization',
              code: `const express = require('express');
const router = express.Router();

router.get('/products', (req, res) => {
  res.json({ products: [] });
});

router.get('/products/:id', (req, res) => {
  res.json({ id: req.params.id });
});

router.post('/products', (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

router.delete('/products/:id', (req, res) => {
  res.status(204).send();
});

const app = express();
app.use('/api', router);
console.log('Products API ready');`,
              tradeoffs: 'More organized for large APIs, but adds complexity for simple APIs'
            },
            {
              approach: 'Using async/await for future database integration',
              code: `const express = require('express');
const app = express();

app.get('/api/products', async (req, res) => {
  // const products = await db.query('SELECT * FROM products');
  res.json({ products: [] });
});

app.get('/api/products/:id', async (req, res) => {
  // const product = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  res.json({ id: req.params.id });
});

app.post('/api/products', async (req, res) => {
  // const result = await db.query('INSERT INTO products ...');
  res.status(201).json({ id: 1, ...req.body });
});

app.delete('/api/products/:id', async (req, res) => {
  // await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

console.log('Products API ready');`,
              tradeoffs: 'Ready for async database operations, but unnecessary complexity if not using async data sources'
            }
          ]
        }
      },
      {
        id: 'request-validation',
        title: 'Request Validation',
        theory: `## Validating API Requests

Never trust client input. Always validate and sanitize data before processing.

### What to Validate
- **Required fields**: Ensure all required data is present
- **Data types**: String, number, boolean, etc.
- **Constraints**: Min/max length, ranges, patterns
- **Format**: Email, URL, date formats

### Validation Libraries
- **Zod**: TypeScript-first, runtime validation
- **Joi**: Powerful schema validation
- **express-validator**: Middleware-based validation

### Validation Patterns
\`\`\`js
// Zod example
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120)
});

const result = userSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error });
}
\`\`\`

### Best Practices
- Validate early (in middleware)
- Return clear error messages
- Sanitize input (remove HTML, trim whitespace)
- Use TypeScript for compile-time safety`,
        exampleCode: `const zod = require('zod');

// Define validation schema
const userSchema = zod.object({
  name: zod.string().min(2).max(50),
  email: zod.string().email(),
  age: zod.number().min(18).max(120)
});

// Test valid data
const validData = {
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
};

const result1 = userSchema.safeParse(validData);
console.log('Valid:', result1.success);

// Test invalid data
const invalidData = {
  name: 'A',
  email: 'not-an-email',
  age: 15
};

const result2 = userSchema.safeParse(invalidData);
console.log('Invalid:', result2.success);
console.log('Error:', result2.error.message);`,
        exercise: {
          instructions: 'Create a Zod schema for a "product" with: name (string, 3-100 chars), price (number, positive), category (string, required). Test it with valid and invalid data.',
          starterCode: `const zod = require('zod');

// Create product schema

// Test with valid data

// Test with invalid data
`,
          expectedOutput: 'Valid product: true\nInvalid product: false',
          solution: `const zod = require('zod');

const productSchema = zod.object({
  name: zod.string().min(3).max(100),
  price: zod.number().positive(),
  category: zod.string()
});

const validProduct = { name: 'Laptop', price: 999, category: 'Electronics' };
const invalidProduct = { name: 'AB', price: -10, category: '' };

console.log('Valid product:', productSchema.safeParse(validProduct).success);
console.log('Invalid product:', productSchema.safeParse(invalidProduct).success);`,
          hint: 'Use zod.string().min(3).max(100) for name, zod.number().positive() for price, zod.string() for category.'
        }
      },
      {
        id: 'error-handling-api',
        title: 'API Error Handling',
        theory: `## Error Handling in APIs

Proper error handling prevents crashes and provides useful feedback to clients.

### Error Categories
- **Validation errors**: Invalid input (400 Bad Request)
- **Authentication errors**: Not logged in (401 Unauthorized)
- **Authorization errors**: No permission (403 Forbidden)
- **Not found**: Resource doesn't exist (404 Not Found)
- **Server errors**: Something broke (500 Internal Server Error)

### Error Response Format
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [...]
  }
}
\`\`\`

### Error Handling Middleware
\`\`\`js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      code: err.code
    }
  });
});
\`\`\`

### Best Practices
- Never expose stack traces in production
- Log errors for debugging
- Use custom error classes
- Handle async errors properly`,
        exampleCode: `// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(\`\${resource} not found\`, 404, 'NOT_FOUND');
  }
}

// Error handler middleware
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const response = {
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message
    }
  };
  console.log(\`Error \${status}: \${err.message}\`);
}

// Test errors
try {
  throw new ValidationError('Invalid email');
} catch (err) {
  errorHandler(err, {}, {});
}

try {
  throw new NotFoundError('User');
} catch (err) {
  errorHandler(err, {}, {});
}`,
        exercise: {
          instructions: 'Create custom error classes: ValidationError (400), NotFoundError (404), UnauthorizedError (401). Create an error handler that logs "Error [status]: message". Test all three.',
          starterCode: `// Create error classes

// Create error handler

// Test errors
`,
          expectedOutput: 'Error [400]: Invalid input\nError [404]: User not found\nError [401]: Not authenticated',
          solution: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(\`\${resource} not found\`, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

function errorHandler(err) {
  console.log(\`Error [\${err.statusCode}]: \${err.message}\`);
}

errorHandler(new ValidationError('Invalid input'));
errorHandler(new NotFoundError('User'));
errorHandler(new UnauthorizedError('Not authenticated'));`,
          hint: 'Extend a base AppError class with statusCode. Each subclass sets its own status code.'
        }
      },
      {
        id: 'pagination-filtering',
        title: 'Pagination & Filtering',
        theory: `## Pagination, Filtering & Sorting

Large datasets need pagination. APIs should support filtering and sorting.

### Pagination
- **Offset-based**: \`?page=2&limit=10\` (skip 10, take 10)
- **Cursor-based**: \`?cursor=abc123&limit=10\` (more efficient for large datasets)

### Filtering
- Query parameters: \`?status=active&role=admin\`
- Range queries: \`?minPrice=100&maxPrice=500\`
- Search: \`?q=laptop\`

### Sorting
- \`?sort=name&order=asc\`
- Multiple fields: \`?sort=createdAt,name\`

### Response Format
\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
\`\`\`

### SQL Implementation
\`\`\`sql
SELECT * FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
\`\`\``,
        exampleCode: `const db = require('pg');

// Pagination helper
function paginate(query, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return \`\${query} LIMIT \${limit} OFFSET \${offset}\`;
}

// Build query with filters
function buildUserQuery(filters) {
  let query = 'SELECT * FROM users';
  const conditions = [];

  if (filters.status) {
    conditions.push(\`status = '\${filters.status}'\`);
  }
  if (filters.role) {
    conditions.push(\`role = '\${filters.role}'\`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';
  return query;
}

// Example usage
const query = buildUserQuery({ status: 'active', role: 'admin' });
const paginatedQuery = paginate(query, 1, 10);

console.log('Query:', query);
console.log('Paginated:', paginatedQuery);`,
        exercise: {
          instructions: 'Create a function "buildProductQuery" that accepts filters (category, minPrice, maxPrice) and returns a SQL query string. Then paginate it with page=2, limit=5.',
          starterCode: `// Create buildProductQuery function

// Create paginate function

// Test with filters
`,
          expectedOutput: 'Query: SELECT * FROM products WHERE category = \'Electronics\' AND price >= 100 AND price <= 500 ORDER BY price ASC\nPaginated: SELECT * FROM products WHERE category = \'Electronics\' AND price >= 100 AND price <= 500 ORDER BY price ASC LIMIT 5 OFFSET 5',
          solution: `function buildProductQuery(filters) {
  let query = 'SELECT * FROM products';
  const conditions = [];

  if (filters.category) {
    conditions.push(\`category = '\${filters.category}'\`);
  }
  if (filters.minPrice) {
    conditions.push(\`price >= \${filters.minPrice}\`);
  }
  if (filters.maxPrice) {
    conditions.push(\`price <= \${filters.maxPrice}\`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY price ASC';
  return query;
}

function paginate(query, page, limit) {
  const offset = (page - 1) * limit;
  return \`\${query} LIMIT \${limit} OFFSET \${offset}\`;
}

const query = buildProductQuery({ category: 'Electronics', minPrice: 100, maxPrice: 500 });
console.log('Query:', query);
console.log('Paginated:', paginate(query, 2, 5));`,
          hint: 'Build WHERE conditions array, join with AND. For pagination: offset = (page - 1) * limit.'
        }
      },
      {
        id: 'api-versioning',
        title: 'API Versioning & Documentation',
        theory: `## API Versioning & Documentation

APIs evolve. Versioning prevents breaking changes. Documentation helps developers use your API.

### Versioning Strategies
- **URL path**: \`/api/v1/users\`, \`/api/v2/users\`
- **Header**: \`Accept: application/vnd.myapi.v1+json\`
- **Query param**: \`/users?version=1\`

URL path versioning is most common and explicit.

### Documentation Tools
- **OpenAPI/Swagger**: Industry standard
- **Postman**: API testing and docs
- **Redoc**: Beautiful API docs from OpenAPI

### OpenAPI Example
\`\`\`yaml
openapi: 3.0.0
paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        200:
          description: Success
\`\`\`

### Best Practices
- Version from day one
- Deprecate old versions gracefully
- Provide migration guides
- Keep documentation updated`,
        exampleCode: `// API versioning with Express
const express = require('express');
const app = express();

// Version 1 routes
const v1Router = express.Router();
v1Router.get('/users', (req, res) => {
  res.json({ users: [{ id: 1, name: 'Alice' }] });
});

// Version 2 routes (with email field)
const v2Router = express.Router();
v2Router.get('/users', (req, res) => {
  res.json({
    users: [{ id: 1, name: 'Alice', email: 'alice@example.com' }]
  });
});

// Mount versioned routes
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

console.log('API v1: /api/v1/users');
console.log('API v2: /api/v2/users (includes email)');
console.log('Versioning allows backward compatibility');`,
        exercise: {
          instructions: 'Create two API versions: v1 returns { id, name }, v2 returns { id, name, email, createdAt }. Mount them at /api/v1/users and /api/v2/users.',
          starterCode: `const express = require('express');
const app = express();

// Create v1 and v2 routers

// Mount versioned routes

console.log('Versioned API ready');
`,
          expectedOutput: 'Versioned API ready',
          solution: `const express = require('express');
const app = express();

const v1Router = express.Router();
v1Router.get('/users', (req, res) => {
  res.json({ users: [{ id: 1, name: 'Alice' }] });
});

const v2Router = express.Router();
v2Router.get('/users', (req, res) => {
  res.json({
    users: [{ id: 1, name: 'Alice', email: 'alice@example.com', createdAt: '2024-01-01' }]
  });
});

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

console.log('Versioned API ready');`,
          hint: 'Create separate Router instances for v1 and v2. Mount with app.use("/api/v1", v1Router).'
        }
      }
    ]
  },
  {
    id: 'postgresql',
    title: 'PostgreSQL & SQL',
    description: 'Master PostgreSQL: queries, relationships, transactions, and performance optimization.',
    icon: '🗄️',
    color: 'from-indigo-500 to-purple-600',
    lessons: [
      {
        id: 'sql-basics',
        title: 'SQL Query Basics',
        theory: `## SQL Query Fundamentals

SQL (Structured Query Language) is the standard for relational databases.

### Basic Queries
\`\`\`sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE age > 18;

-- Sort results
SELECT * FROM users ORDER BY created_at DESC;

-- Limit results
SELECT * FROM users LIMIT 10;
\`\`\`

### Aggregations
\`\`\`sql
-- Count rows
SELECT COUNT(*) FROM users;

-- Sum, avg, min, max
SELECT AVG(age) FROM users;
SELECT MAX(price) FROM products;

-- Group by
SELECT role, COUNT(*) FROM users GROUP BY role;
\`\`\`

### Joins
\`\`\`sql
-- Inner join
SELECT u.name, p.title
FROM users u
JOIN posts p ON u.id = p.user_id;
\`\`\`

### CRUD Operations
- **CREATE**: INSERT INTO
- **READ**: SELECT
- **UPDATE**: UPDATE
- **DELETE**: DELETE FROM`,
        exampleCode: `const db = require('pg');

// Simulated database queries
const queries = [
  'SELECT * FROM users',
  'SELECT name, email FROM users WHERE age > 25',
  'SELECT COUNT(*) as total FROM users',
  'SELECT role, COUNT(*) as count FROM users GROUP BY role',
  'SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id'
];

queries.forEach((query, i) => {
  console.log(\`Query \${i + 1}: \${query}\`);
});

console.log('\\nSQL operations:');
console.log('SELECT - Read data');
console.log('INSERT - Create data');
console.log('UPDATE - Modify data');
console.log('DELETE - Remove data');`,
        exercise: {
          instructions: 'Write SQL queries (as strings) for: 1) Select all users over 30, 2) Count users by role, 3) Join users with their posts. Print each query.',
          starterCode: `// Write your SQL queries

// Print them
`,
          expectedOutput: 'Query 1: SELECT * FROM users WHERE age > 30\nQuery 2: SELECT role, COUNT(*) FROM users GROUP BY role\nQuery 3: SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id',
          solution: `const queries = [
  'SELECT * FROM users WHERE age > 30',
  'SELECT role, COUNT(*) FROM users GROUP BY role',
  'SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id'
];

queries.forEach((query, i) => {
  console.log(\`Query \${i + 1}: \${query}\`);
});`,
          hint: 'Use WHERE for filtering, GROUP BY for aggregation, JOIN for combining tables.'
        }
      },
      {
        id: 'node-postgres',
        title: 'Node.js with PostgreSQL',
        theory: `## Using PostgreSQL with Node.js

The \`pg\` package (node-postgres) is the standard PostgreSQL client for Node.js.

### Connection Pool
\`\`\`js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'mydb',
  user: 'postgres',
  password: 'secret',
  port: 5432
});
\`\`\`

### Querying
\`\`\`js
// Simple query
const result = await pool.query('SELECT * FROM users');

// Parameterized query (prevents SQL injection)
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// Insert with returning
const result = await pool.query(
  'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
  ['Alice', 'alice@example.com']
);
\`\`\`

### Transactions
\`\`\`js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
  await client.query('UPDATE accounts SET balance = balance + 100 WHERE id = 2');
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
\`\`\``,
        exampleCode: `const pg = require('pg');
const Pool = pg.Pool;

// Create connection pool
const pool = new Pool({
  connectionString: 'postgresql://localhost/mydb'
});

// Query example
async function getUsers() {
  const result = await pool.query('SELECT * FROM users WHERE active = true');
  return result.rows;
}

// Parameterized query
async function getUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

// Insert with returning
async function createUser(name, email) {
  const result = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
    [name, email]
  );
  return result.rows[0];
}

console.log('PostgreSQL client configured');
console.log('Use parameterized queries to prevent SQL injection');
console.log('Always use connection pools in production');`,
        exercise: {
          instructions: 'Create functions: getUserByEmail(email), createPost(userId, title, content), deleteUser(id). Use parameterized queries with $1, $2, etc.',
          starterCode: `const pg = require('pg');
const pool = new pg.Pool({ connectionString: 'postgresql://localhost/mydb' });

// Create your functions

console.log('Database functions ready');
`,
          expectedOutput: 'Database functions ready',
          solution: `const pg = require('pg');
const pool = new pg.Pool({ connectionString: 'postgresql://localhost/mydb' });

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function createPost(userId, title, content) {
  const result = await pool.query(
    'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, content]
  );
  return result.rows[0];
}

async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

console.log('Database functions ready');`,
          hint: 'Use $1, $2, $3 for parameters. Always return result.rows for SELECT, result.rows[0] for single row.'
        }
      },
      {
        id: 'schema-design',
        title: 'Database Schema Design',
        theory: `## Database Schema Design

Good schema design prevents data anomalies and improves performance.

### Normalization
- **1NF**: Atomic values (no arrays in columns)
- **2NF**: No partial dependencies
- **3NF**: No transitive dependencies

### Common Patterns
- **One-to-many**: users → posts (foreign key in posts)
- **Many-to-many**: users ↔ tags (join table)
- **One-to-one**: users → profiles (foreign key with unique constraint)

### Schema Example
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
\`\`\`

### Indexes
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
\`\`\``,
        exampleCode: `// Schema design patterns
const schemas = {
  users: \`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  \`,
  posts: \`
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  \`,
  indexes: [
    'CREATE INDEX idx_users_email ON users(email)',
    'CREATE INDEX idx_posts_user_id ON posts(user_id)'
  ]
};

console.log('Schema design principles:');
console.log('1. Normalize to reduce redundancy');
console.log('2. Use foreign keys for relationships');
console.log('3. Add indexes for frequently queried columns');
console.log('4. Use CASCADE for dependent deletes');`,
        exercise: {
          instructions: 'Design a schema for an e-commerce app: users, products, orders, order_items. Define relationships and print the CREATE TABLE statements.',
          starterCode: `// Design your schema

// Print CREATE TABLE statements
`,
          expectedOutput: 'CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL)\nCREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL)\nCREATE TABLE orders (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), total DECIMAL(10,2) NOT NULL)\nCREATE TABLE order_items (order_id INTEGER REFERENCES orders(id), product_id INTEGER REFERENCES products(id), quantity INTEGER NOT NULL)',
          solution: `const tables = [
  'CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL)',
  'CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL)',
  'CREATE TABLE orders (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), total DECIMAL(10,2) NOT NULL)',
  'CREATE TABLE order_items (order_id INTEGER REFERENCES orders(id), product_id INTEGER REFERENCES products(id), quantity INTEGER NOT NULL)'
];

tables.forEach(sql => console.log(sql));`,
          hint: 'users → orders (one-to-many), orders → order_items (one-to-many), products → order_items (one-to-many).'
        }
      },
      {
        id: 'transactions',
        title: 'Database Transactions',
        theory: `## Database Transactions

Transactions ensure data consistency by grouping operations that must succeed or fail together.

### ACID Properties
- **Atomicity**: All or nothing
- **Consistency**: Database stays valid
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed data persists

### Transaction Syntax
\`\`\`js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  
  // Multiple operations
  await client.query('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
  await client.query('UPDATE accounts SET balance = balance + 100 WHERE id = 2');
  
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
\`\`\`

### When to Use Transactions
- Money transfers
- Multi-step data updates
- Maintaining referential integrity
- Batch operations

### Isolation Levels
- **READ COMMITTED**: Default, sees committed data
- **REPEATABLE READ**: Consistent snapshot
- **SERIALIZABLE**: Full isolation (slowest)`,
        exampleCode: `const pg = require('pg');
const pool = new pg.Pool();

// Transaction example: money transfer
async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Deduct from sender
    const sender = await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance',
      [amount, fromId]
    );
    
    if (sender.rows[0].balance < 0) {
      throw new Error('Insufficient funds');
    }
    
    // Add to recipient
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toId]
    );
    
    await client.query('COMMIT');
    console.log(\`Transferred $\${amount} from \${fromId} to \${toId}\`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.log('Transaction failed:', e.message);
    throw e;
  } finally {
    client.release();
  }
}

console.log('Transaction pattern: BEGIN → operations → COMMIT/ROLLBACK');
console.log('Ensures atomicity: all operations succeed or all fail');`,
        exercise: {
          instructions: 'Create a transaction function "createOrderWithItems" that: 1) Creates an order, 2) Adds order_items, 3) Updates product stock. Use BEGIN/COMMIT/ROLLBACK pattern.',
          starterCode: `const pg = require('pg');
const pool = new pg.Pool();

// Create transaction function

console.log('Transaction function ready');
`,
          expectedOutput: 'Transaction function ready',
          solution: `const pg = require('pg');
const pool = new pg.Pool();

async function createOrderWithItems(userId, items) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, 0) RETURNING id',
      [userId]
    );
    const orderId = orderResult.rows[0].id;
    
    // Add order items and update stock
    let total = 0;
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.productId, item.quantity]
      );
      
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
      
      total += item.price * item.quantity;
    }
    
    // Update order total
    await client.query('UPDATE orders SET total = $1 WHERE id = $2', [total, orderId]);
    
    await client.query('COMMIT');
    return orderId;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

console.log('Transaction function ready');`,
          hint: 'Use client.connect(), BEGIN, try/catch with ROLLBACK, finally with client.release().'
        }
      },
      {
        id: 'query-optimization',
        title: 'Query Optimization & Indexes',
        theory: `## Query Optimization

Slow queries kill performance. Optimize with indexes, query analysis, and proper design.

### Indexes
\`\`\`sql
-- Single column
CREATE INDEX idx_users_email ON users(email);

-- Composite
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);

-- Unique
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
\`\`\`

### Query Analysis
\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';
\`\`\`

Look for:
- **Seq Scan**: Scanning entire table (bad for large tables)
- **Index Scan**: Using index (good)
- **Rows**: Estimated vs actual rows

### Optimization Techniques
1. **Add indexes** for WHERE, JOIN, ORDER BY columns
2. **Select only needed columns** (not SELECT *)
3. **Use LIMIT** for large result sets
4. **Avoid N+1 queries** (use JOINs)
5. **Cache frequently accessed data**

### N+1 Problem
\`\`\`js
// BAD: N+1 queries
const users = await pool.query('SELECT * FROM users');
for (const user of users.rows) {
  const posts = await pool.query('SELECT * FROM posts WHERE user_id = $1', [user.id]);
}

// GOOD: Single query with JOIN
const result = await pool.query(\`
  SELECT u.*, p.* FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
\`);
\`\`\``,
        exampleCode: `// Query optimization examples
const queries = {
  bad: 'SELECT * FROM users',
  good: 'SELECT id, name, email FROM users WHERE active = true LIMIT 100',
  
  nPlus1: \`
    // BAD: N+1 queries
    const users = await db.query('SELECT * FROM users');
    for (const user of users) {
      await db.query('SELECT * FROM posts WHERE user_id = ' + user.id);
    }
  \`,
  
  optimized: \`
    // GOOD: Single JOIN query
    const result = await db.query(\`
      SELECT u.id, u.name, p.title
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      WHERE u.active = true
    \`);
  \`
};

console.log('Optimization principles:');
console.log('1. Add indexes for frequently queried columns');
console.log('2. Select only needed columns');
console.log('3. Use LIMIT for pagination');
console.log('4. Avoid N+1 queries with JOINs');
console.log('5. Use EXPLAIN ANALYZE to identify slow queries');`,
        exercise: {
          instructions: 'Given a slow query "SELECT * FROM orders WHERE user_id = 123 AND status = \'completed\' ORDER BY created_at DESC", optimize it by: 1) Selecting only needed columns, 2) Suggesting indexes, 3) Rewriting to avoid N+1.',
          starterCode: `// Original slow query
const slowQuery = "SELECT * FROM orders WHERE user_id = 123 AND status = 'completed' ORDER BY created_at DESC";

// Optimize it

// Suggest indexes

// Rewrite to avoid N+1
`,
          expectedOutput: 'Optimized: SELECT id, user_id, total, created_at FROM orders WHERE user_id = 123 AND status = \'completed\' ORDER BY created_at DESC LIMIT 50\nIndexes: CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at)\nN+1 fix: SELECT o.id, o.total, u.name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = \'completed\'',
          solution: `const optimized = "SELECT id, user_id, total, created_at FROM orders WHERE user_id = 123 AND status = 'completed' ORDER BY created_at DESC LIMIT 50";
const indexes = "CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at)";
const nPlus1Fix = "SELECT o.id, o.total, u.name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'completed'";

console.log('Optimized:', optimized);
console.log('Indexes:', indexes);
console.log('N+1 fix:', nPlus1Fix);`,
          hint: 'Replace SELECT * with specific columns. Add composite index on (user_id, status, created_at). Use JOIN instead of separate queries.'
        }
      }
    ]
  }
];

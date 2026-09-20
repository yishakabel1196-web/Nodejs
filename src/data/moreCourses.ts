import { Course } from './types';

export const moreCourses: Course[] = [
  {
    id: 'authentication',
    title: 'Authentication & Security',
    description: 'Implement JWT auth, password hashing, sessions, and security best practices.',
    icon: '🔐',
    color: 'from-red-500 to-rose-600',
    lessons: [
      {
        id: 'jwt-basics',
        title: 'JWT Authentication',
        theory: `## JSON Web Tokens (JWT)

JWTs are stateless tokens for authentication. The server signs them, clients send them back.

### JWT Structure
- **Header**: Algorithm and type
- **Payload**: User data (claims)
- **Signature**: Prevents tampering

### Flow
1. User logs in with credentials
2. Server validates and creates JWT
3. Server sends JWT to client
4. Client stores JWT (localStorage, cookie)
5. Client sends JWT in Authorization header
6. Server verifies JWT on each request

### Code Example
\`\`\`js
const jwt = require('jsonwebtoken');

// Sign token
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  'secret-key',
  { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, 'secret-key');
console.log(decoded.userId); // 123
\`\`\`

### Security Best Practices
- Use strong, random secrets
- Set short expiration times
- Store tokens securely (httpOnly cookies preferred)
- Never put sensitive data in payload
- Use HTTPS always`,
        exampleCode: `const jwt = require('jsonwebtoken');

// Create a token
const payload = { userId: 42, email: 'alice@example.com', role: 'admin' };
const secret = 'my-super-secret-key';
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Token created:', token.substring(0, 50) + '...');

// Verify the token
const decoded = jwt.verify(token, secret);
console.log('Decoded userId:', decoded.userId);
console.log('Decoded role:', decoded.role);

// Token parts
const parts = token.split('.');
console.log('Token has 3 parts:', parts.length === 3);`,
        exercise: {
          instructions: 'Create a JWT with { userId: 1, role: "user" }, sign it with secret "node-academy-secret", then verify it and print the decoded userId and role.',
          starterCode: `const jwt = require('jsonwebtoken');

// Create and sign token

// Verify and decode

// Print decoded data
`,
          expectedOutput: 'userId: 1\nrole: user',
          solution: `const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 1, role: 'user' }, 'node-academy-secret');
const decoded = jwt.verify(token, 'node-academy-secret');

console.log('userId:', decoded.userId);
console.log('role:', decoded.role);`,
          hint: 'Use jwt.sign(payload, secret) to create, jwt.verify(token, secret) to decode.'
        }
      },
      {
        id: 'password-hashing',
        title: 'Password Hashing with bcrypt',
        theory: `## Password Hashing

Never store plain-text passwords. Hash them with bcrypt.

### Why Hashing?
- If database is breached, passwords are safe
- Hashing is one-way (can't reverse)
- Salt prevents rainbow table attacks

### bcrypt Flow
1. User registers with password
2. Hash password: \`bcrypt.hash(password, rounds)\`
3. Store hash in database
4. User logs in with password
5. Compare: \`bcrypt.compare(password, hash)\`
6. If match, authenticate

### Code Example
\`\`\`js
const bcrypt = require('bcrypt');

// Hash password (during registration)
const hash = await bcrypt.hash('myPassword123', 10);

// Verify password (during login)
const isValid = await bcrypt.compare('myPassword123', hash);
console.log(isValid); // true
\`\`\`

### Rounds (Cost Factor)
- More rounds = slower = more secure
- 10-12 rounds recommended
- Each round doubles the time

### Security Tips
- Use at least 10 rounds
- Never log passwords
- Enforce strong password policies
- Rate limit login attempts`,
        exampleCode: `const bcrypt = require('bcrypt');

// Hash a password
const password = 'SecurePass123!';
const rounds = 10;

const hash = bcrypt.hash(password, rounds);
console.log('Hash:', hash);

// Verify correct password
const isValid = bcrypt.compare('SecurePass123!', hash);
console.log('Correct password:', isValid);

// Verify wrong password
const isInvalid = bcrypt.compare('WrongPassword', hash);
console.log('Wrong password:', isInvalid);`,
        exercise: {
          instructions: 'Hash the password "MySecret2024!" with 12 rounds. Then verify it with the correct password and a wrong password. Print the results.',
          starterCode: `const bcrypt = require('bcrypt');

// Hash password

// Verify correct password

// Verify wrong password
`,
          expectedOutput: 'Correct: true\nWrong: false',
          solution: `const bcrypt = require('bcrypt');

const hash = bcrypt.hash('MySecret2024!', 12);

const correct = bcrypt.compare('MySecret2024!', hash);
console.log('Correct:', correct);

const wrong = bcrypt.compare('WrongPassword', hash);
console.log('Wrong:', wrong);`,
          hint: 'Use bcrypt.hash(password, rounds) to hash, bcrypt.compare(password, hash) to verify.'
        }
      },
      {
        id: 'auth-middleware',
        title: 'Auth Middleware',
        theory: `## Authentication Middleware

Protect routes with middleware that checks for valid tokens.

### Pattern
\`\`\`js
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Use on protected routes
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
\`\`\`

### Role-Based Access
\`\`\`js
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

app.delete('/api/users/:id',
  authMiddleware,
  requireRole('admin'),
  deleteUserHandler
);
\`\`\`

### Best Practices
- Extract token from Authorization header
- Handle expired tokens gracefully
- Include user info in req object
- Use separate middleware for auth and authorization`,
        exampleCode: `const jwt = require('jsonwebtoken');

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return { status: 401, body: { error: 'No token provided' } };
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, 'secret-key');
    req.user = decoded;
    return next();
  } catch (err) {
    return { status: 401, body: { error: 'Invalid token' } };
  }
}

// Simulate protected route
function simulateRequest(headers) {
  const req = { headers, user: null };
  const res = { _status: 200, _body: null };
  
  const result = authMiddleware(req, res, () => {
    return { status: 200, body: { user: req.user } };
  });
  
  return result || { status: res._status, body: res._body };
}

// Test with valid token
const token = jwt.sign({ userId: 1 }, 'secret-key');
const result1 = simulateRequest({ authorization: 'Bearer ' + token });
console.log('With token:', JSON.stringify(result1));

// Test without token
const result2 = simulateRequest({});
console.log('No token:', JSON.stringify(result2));`,
        exercise: {
          instructions: 'Create an auth middleware that: 1) Extracts token from "Authorization: Bearer <token>", 2) Verifies with jwt.verify, 3) Sets req.user, 4) Returns 401 if invalid. Test with and without token.',
          starterCode: `const jwt = require('jsonwebtoken');

// Create auth middleware

// Test it
`,
          expectedOutput: 'Auth success: {"userId":1,"role":"admin"}\nNo token: 401 Unauthorized',
          solution: `const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return { status: 401, body: '401 Unauthorized' };
  
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, 'secret');
    return next();
  } catch {
    return { status: 401, body: '401 Unauthorized' };
  }
}

// Test with token
const token = jwt.sign({ userId: 1, role: 'admin' }, 'secret');
const req1 = { headers: { authorization: 'Bearer ' + token }, user: null };
const result1 = auth(req1, {}, () => ({ status: 200, body: JSON.stringify(req1.user) }));
console.log('Auth success:', result1.body);

// Test without token
const req2 = { headers: {}, user: null };
const result2 = auth(req2, {}, () => {});
console.log('No token:', result2.body);`,
          hint: 'Split authorization header by space, take index 1 for token. Use jwt.verify(token, secret).'
        }
      },
      {
        id: 'login-register',
        title: 'Login & Register Routes',
        theory: `## Building Login & Register

The two most important auth endpoints in any API.

### Register Flow
1. Receive email + password
2. Validate input
3. Check if user exists
4. Hash password
5. Create user in database
6. Return JWT

### Login Flow
1. Receive email + password
2. Find user by email
3. Compare password with hash
4. If match, generate JWT
5. Return JWT

### Code Example
\`\`\`js
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Check existing user
  const existing = await pool.query(
    'SELECT * FROM users WHERE email = $1', [email]
  );
  if (existing.rows.length > 0) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  // Hash and create
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [email, hash]
  );
  
  const token = jwt.sign({ userId: result.rows[0].id }, SECRET);
  res.status(201).json({ token, user: result.rows[0] });
});
\`\`\``,
        exampleCode: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Simulated user database
const users = [];

// Register
async function register(email, password) {
  // Check if exists
  const existing = users.find(u => u.email === email);
  if (existing) {
    return { error: 'Email already registered' };
  }
  
  // Hash password
  const hash = bcrypt.hash(password, 10);
  
  // Create user
  const user = { id: users.length + 1, email, password_hash: hash };
  users.push(user);
  
  // Generate token
  const token = jwt.sign({ userId: user.id }, 'secret');
  
  return { token, user: { id: user.id, email } };
}

// Login
async function login(email, password) {
  const user = users.find(u => u.email === email);
  if (!user) {
    return { error: 'Invalid credentials' };
  }
  
  const isValid = bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return { error: 'Invalid credentials' };
  }
  
  const token = jwt.sign({ userId: user.id }, 'secret');
  return { token, user: { id: user.id, email } };
}

// Test
async function test() {
  const reg = await register('test@example.com', 'password123');
  console.log('Register:', JSON.stringify(reg));
  
  const loginResult = await login('test@example.com', 'password123');
  console.log('Login:', JSON.stringify(loginResult));
}

test();`,
        exercise: {
          instructions: 'Build register and login functions. Register should hash password and return JWT. Login should verify password and return JWT. Test both flows.',
          starterCode: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const users = [];

// Build register function

// Build login function

// Test both
`,
          expectedOutput: 'Registered: alice@test.com\nLogin success: alice@test.com',
          solution: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const users = [];

async function register(email, password) {
  const hash = bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, password_hash: hash };
  users.push(user);
  return { email: user.email };
}

async function login(email, password) {
  const user = users.find(u => u.email === email);
  if (!user) return { error: 'Not found' };
  
  const valid = bcrypt.compare(password, user.password_hash);
  if (!valid) return { error: 'Wrong password' };
  
  return { email: user.email };
}

async function test() {
  const reg = await register('alice@test.com', 'pass123');
  console.log('Registered:', reg.email);
  
  const log = await login('alice@test.com', 'pass123');
  console.log('Login success:', log.email);
}

test();`,
          hint: 'Register: hash password, store user. Login: find user, compare password, return success.'
        }
      },
      {
        id: 'security-best-practices',
        title: 'Security Best Practices',
        theory: `## Security Best Practices

Security is not optional. Follow these practices to protect your API.

### Essential Security Measures
1. **HTTPS**: Always use HTTPS in production
2. **Environment variables**: Never hardcode secrets
3. **Input validation**: Validate all user input
4. **Rate limiting**: Prevent brute force attacks
5. **CORS**: Configure properly
6. **Helmet**: Set security headers
7. **SQL injection**: Use parameterized queries
8. **XSS**: Sanitize output
9. **CSRF**: Use tokens for state-changing operations

### Environment Variables
\`\`\`js
// .env file
DB_PASSWORD=supersecret
JWT_SECRET=anothersecret

// In code
require('dotenv').config();
const secret = process.env.JWT_SECRET;
\`\`\`

### Rate Limiting
\`\`\`js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});

app.use('/api/', limiter);
\`\`\`

### CORS Configuration
\`\`\`js
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
\`\`\`

### Security Headers (Helmet)
\`\`\`js
const helmet = require('helmet');
app.use(helmet());
\`\`\``,
        exampleCode: `// Security checklist
const securityChecks = [
  { name: 'HTTPS', status: 'required', description: 'Encrypt all traffic' },
  { name: 'Environment Variables', status: 'required', description: 'Never hardcode secrets' },
  { name: 'Input Validation', status: 'required', description: 'Validate all user input' },
  { name: 'Rate Limiting', status: 'recommended', description: 'Prevent brute force' },
  { name: 'CORS', status: 'required', description: 'Restrict origins' },
  { name: 'Helmet', status: 'recommended', description: 'Security headers' },
  { name: 'Parameterized Queries', status: 'required', description: 'Prevent SQL injection' },
  { name: 'Password Hashing', status: 'required', description: 'Use bcrypt' },
];

console.log('Security Checklist:');
securityChecks.forEach(check => {
  console.log(\`[\${check.status.toUpperCase()}] \${check.name}: \${check.description}\`);
});`,
        exercise: {
          instructions: 'Create a security middleware that checks for: 1) HTTPS (in production), 2) Rate limiting (track requests per IP), 3) CORS headers. Print which checks pass.',
          starterCode: `// Create security middleware

// Test it
`,
          expectedOutput: 'HTTPS check: PASS (development)\nRate limit: PASS (42/100 requests)\nCORS: PASS (allowed: https://myapp.com)',
          solution: `// Security middleware
const requestCounts = {};

function securityMiddleware(req, res, next) {
  // HTTPS check
  const isHttps = req.headers['x-forwarded-proto'] === 'https';
  const isDev = process.env.NODE_ENV !== 'production';
  console.log('HTTPS check:', (isHttps || isDev) ? 'PASS (development)' : 'FAIL');
  
  // Rate limiting
  const ip = '127.0.0.1';
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;
  const count = requestCounts[ip];
  console.log(\`Rate limit: \${count < 100 ? 'PASS' : 'FAIL'} (\${count}/100 requests)\`);
  
  // CORS
  const allowedOrigins = ['https://myapp.com'];
  const origin = req.headers.origin || 'https://myapp.com';
  console.log(\`CORS: \${allowedOrigins.includes(origin) ? 'PASS' : 'FAIL'} (allowed: \${origin})\`);
  
  next();
}

// Test
securityMiddleware(
  { headers: { origin: 'https://myapp.com' } },
  {},
  () => {}
);`,
          hint: 'Check x-forwarded-proto for HTTPS, track request counts per IP, validate origin against allowed list.'
        }
      }
    ]
  },
  {
    id: 'testing',
    title: 'Testing Node.js',
    description: 'Write unit tests, integration tests, and end-to-end tests with Jest and Supertest.',
    icon: '🧪',
    color: 'from-green-500 to-teal-600',
    lessons: [
      {
        id: 'testing-intro',
        title: 'Introduction to Testing',
        theory: `## Why Test?

Tests prevent bugs, enable refactoring, and document behavior.

### Testing Pyramid
- **Unit tests**: Test individual functions (many, fast)
- **Integration tests**: Test module interactions (fewer, slower)
- **E2E tests**: Test full user flows (fewest, slowest)

### Jest Basics
\`\`\`js
// Math functions
function add(a, b) { return a + b; }

// Test
test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('adds negative numbers', () => {
  expect(add(-1, -2)).toBe(-3);
});
\`\`\`

### Matchers
- \`toBe()\` - strict equality
- \`toEqual()\` - deep equality
- \`toBeTruthy()\` / \`toBeFalsy()\`
- \`toContain()\` - array includes
- \`toThrow()\` - function throws
- \`resolves\` / \`rejects\` - async

### Best Practices
- Test behavior, not implementation
- One assertion per test (usually)
- Descriptive test names
- Arrange-Act-Assert pattern`,
        exampleCode: `// Simple test framework simulation
function describe(name, fn) {
  console.log(\`\\n📋 \${name}\`);
  fn();
}

function test(name, fn) {
  try {
    fn();
    console.log(\`  ✅ \${name}\`);
  } catch (err) {
    console.log(\`  ❌ \${name}: \${err.message}\`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(\`Expected \${expected}, got \${actual}\`);
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error('Objects not equal');
      }
    }
  };
}

// Tests
function add(a, b) { return a + b; }

describe('add function', () => {
  test('adds positive numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
  
  test('adds negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });
  
  test('adds zero', () => {
    expect(add(5, 0)).toBe(5);
  });
});`,
        exercise: {
          instructions: 'Create a "multiply" function and write 3 tests for it: positive numbers, negative numbers, and multiplying by zero.',
          starterCode: `// Test framework
function describe(name, fn) { console.log(\`\\n📋 \${name}\`); fn(); }
function test(name, fn) {
  try { fn(); console.log(\`  ✅ \${name}\`); }
  catch (err) { console.log(\`  ❌ \${name}: \${err.message}\`); }
}
function expect(actual) {
  return { toBe(expected) { if (actual !== expected) throw new Error(\`Expected \${expected}, got \${actual}\`); } };
}

// Create multiply function

// Write tests
`,
          expectedOutput: '📋 multiply function\n  ✅ multiplies positive numbers\n  ✅ multiplies negative numbers\n  ✅ multiplies by zero',
          solution: `function describe(name, fn) { console.log(\`\\n📋 \${name}\`); fn(); }
function test(name, fn) {
  try { fn(); console.log(\`  ✅ \${name}\`); }
  catch (err) { console.log(\`  ❌ \${name}: \${err.message}\`); }
}
function expect(actual) {
  return { toBe(expected) { if (actual !== expected) throw new Error(\`Expected \${expected}, got \${actual}\`); } };
}

function multiply(a, b) { return a * b; }

describe('multiply function', () => {
  test('multiplies positive numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });
  test('multiplies negative numbers', () => {
    expect(multiply(-2, -3)).toBe(6);
  });
  test('multiplies by zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });
});`,
          hint: 'multiply(a, b) returns a * b. Test with (3,4)=12, (-2,-3)=6, (5,0)=0.'
        }
      },
      {
        id: 'unit-testing',
        title: 'Unit Testing Functions',
        theory: `## Unit Testing

Unit tests verify individual functions work correctly in isolation.

### What to Test
- Input validation
- Edge cases (empty, null, undefined)
- Boundary values
- Error handling
- Return values

### Arrange-Act-Assert
\`\`\`js
test('formats currency', () => {
  // Arrange
  const amount = 1234.5;
  
  // Act
  const result = formatCurrency(amount);
  
  // Assert
  expect(result).toBe('$1,234.50');
});
\`\`\`

### Testing Edge Cases
\`\`\`js
describe('divide', () => {
  test('divides normally', () => {
    expect(divide(10, 2)).toBe(5);
  });
  
  test('throws on divide by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });
  
  test('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });
});
\`\`\`

### Mocking Dependencies
When a function depends on external services, mock them:
\`\`\`js
jest.mock('./database');
const db = require('./database');
db.query.mockResolvedValue([{ id: 1 }]);
\`\`\``,
        exampleCode: `// Test framework
function describe(name, fn) { console.log(\`\\n📋 \${name}\`); fn(); }
function test(name, fn) {
  try { fn(); console.log(\`  ✅ \${name}\`); }
  catch (err) { console.log(\`  ❌ \${name}: \${err.message}\`); }
}
function expect(actual) {
  return {
    toBe(expected) { if (actual !== expected) throw new Error(\`Expected \${expected}, got \${actual}\`); },
    toThrow(msg) {
      try { actual(); throw new Error('Did not throw'); }
      catch (e) { if (!e.message.includes(msg)) throw new Error(\`Wrong error: \${e.message}\`); }
    }
  };
}

// Function to test
function calculateDiscount(price, discountPercent) {
  if (price < 0) throw new Error('Price cannot be negative');
  if (discountPercent < 0 || discountPercent > 100) throw new Error('Invalid discount');
  return price - (price * discountPercent / 100);
}

// Tests
describe('calculateDiscount', () => {
  test('calculates 10% discount', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });
  
  test('calculates 50% discount', () => {
    expect(calculateDiscount(200, 50)).toBe(100);
  });
  
  test('throws on negative price', () => {
    expect(() => calculateDiscount(-10, 10)).toThrow('Price cannot be negative');
  });
});`,
        exercise: {
          instructions: 'Create a "validateEmail" function that returns true for valid emails, false otherwise. Write tests for: valid email, missing @, missing domain, empty string.',
          starterCode: `function describe(name, fn) { console.log(\`\\n📋 \${name}\`); fn(); }
function test(name, fn) {
  try { fn(); console.log(\`  ✅ \${name}\`); }
  catch (err) { console.log(\`  ❌ \${name}: \${err.message}\`); }
}
function expect(actual) {
  return { toBe(expected) { if (actual !== expected) throw new Error(\`Expected \${expected}, got \${actual}\`); } };
}

// Create validateEmail function

// Write tests
`,
          expectedOutput: '📋 validateEmail\n  ✅ accepts valid email\n  ✅ rejects missing @\n  ✅ rejects missing domain\n  ✅ rejects empty string',
          solution: `function describe(name, fn) { console.log(\`\\n📋 \${name}\`); fn(); }
function test(name, fn) {
  try { fn(); console.log(\`  ✅ \${name}\`); }
  catch (err) { console.log(\`  ❌ \${name}: \${err.message}\`); }
}
function expect(actual) {
  return { toBe(expected) { if (actual !== expected) throw new Error(\`Expected \${expected}, got \${actual}\`); } };
}

function validateEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

describe('validateEmail', () => {
  test('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });
  test('rejects missing @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });
  test('rejects missing domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });
  test('rejects empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});`,
          hint: 'Use regex /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ to validate email format.'
        }
      },
      {
        id: 'async-testing',
        title: 'Testing Async Code',
        theory: `## Testing Async Code

Async code requires special handling in tests.

### Testing Promises
\`\`\`js
test('fetches user', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});
\`\`\`

### Testing Resolved/Rejected
\`\`\`js
test('resolves with data', async () => {
  await expect(fetchData()).resolves.toBe('data');
});

test('rejects with error', async () => {
  await expect(fetchBad()).rejects.toThrow('Not found');
});
\`\`\`

### Mocking Async Functions
\`\`\`js
jest.mock('./api');
const api = require('./api');
api.fetchUser.mockResolvedValue({ name: 'Alice' });

test('uses api', async () => {
  const result = await getUser(1);
  expect(result.name).toBe('Alice');
});
\`\`\`

### Timer Mocks
\`\`\`js
jest.useFakeTimers();

test('calls callback after delay', () => {
  const callback = jest.fn();
  setTimeout(callback, 1000);
  
  jest.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalled();
});
\`\`\``,
        exampleCode: `// Async test simulation
async function runTest(name, fn) {
  try {
    await fn();
    console.log(\`  ✅ \${name}\`);
  } catch (err) {
    console.log(\`  ❌ \${name}: \${err.message}\`);
  }
}

// Async function to test
async function fetchUser(id) {
  return Promise.resolve({ id, name: 'User ' + id, active: true });
}

async function fetchUserBad(id) {
  return Promise.reject(new Error('User not found'));
}

// Run tests
async function runTests() {
  console.log('\\n📋 Async tests');
  
  await runTest('resolves with user data', async () => {
    const user = await fetchUser(1);
    if (user.name !== 'User 1') throw new Error('Wrong name');
  });
  
  await runTest('rejects with error', async () => {
    try {
      await fetchUserBad(999);
      throw new Error('Should have rejected');
    } catch (e) {
      if (e.message !== 'User not found') throw new Error('Wrong error');
    }
  });
  
  await runTest('returns active user', async () => {
    const user = await fetchUser(1);
    if (!user.active) throw new Error('User not active');
  });
}

runTests();`,
        exercise: {
          instructions: 'Create an async function "fetchProduct(id)" that resolves with { id, name, price }. Create "fetchProductBad(id)" that rejects. Write 3 async tests.',
          starterCode: `async function runTest(name, fn) {
  try { await fn(); console.log(\`  ✅ \${name}\`); }
  catch (err) { console.log(\`  ❌ \${name}: \${err.message}\`); }
}

// Create async functions

// Write tests
async function runTests() {
  console.log('\\n📋 Product tests');
}

runTests();
`,
          expectedOutput: '📋 Product tests\n  ✅ fetches product by id\n  ✅ rejects for invalid id\n  ✅ returns product with price',
          solution: `async function runTest(name, fn) {
  try { await fn(); console.log(\`  ✅ \${name}\`); }
  catch (err) { console.log(\`  ❌ \${name}: \${err.message}\`); }
}

async function fetchProduct(id) {
  if (id < 1) throw new Error('Invalid id');
  return { id, name: 'Product ' + id, price: 99.99 };
}

async function runTests() {
  console.log('\\n📋 Product tests');
  
  await runTest('fetches product by id', async () => {
    const product = await fetchProduct(1);
    if (product.id !== 1) throw new Error('Wrong id');
  });
  
  await runTest('rejects for invalid id', async () => {
    try {
      await fetchProduct(-1);
      throw new Error('Should have rejected');
    } catch (e) {
      if (e.message !== 'Invalid id') throw e;
    }
  });
  
  await runTest('returns product with price', async () => {
    const product = await fetchProduct(1);
    if (!product.price) throw new Error('Missing price');
  });
}

runTests();`,
          hint: 'Use Promise.resolve() for success, Promise.reject() for errors. Test with await.'
        }
      },
      {
        id: 'integration-testing',
        title: 'Integration Testing APIs',
        theory: `## Integration Testing

Test how modules work together, especially API endpoints.

### Supertest
\`\`\`js
const request = require('supertest');
const app = require('./app');

test('GET /api/users returns users', async () => {
  const response = await request(app)
    .get('/api/users')
    .expect(200);
  
  expect(response.body).toHaveLength(2);
});

test('POST /api/users creates user', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({ name: 'Alice', email: 'alice@test.com' })
    .expect(201);
  
  expect(response.body.name).toBe('Alice');
});
\`\`\`

### Test Database
- Use separate test database
- Reset between tests
- Use transactions or factories

### Setup/Teardown
\`\`\`js
beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.close();
});

beforeEach(async () => {
  await db.query('DELETE FROM users');
});
\`\`\`

### Testing Auth
\`\`\`js
test('protected route requires auth', async () => {
  await request(app)
    .get('/api/profile')
    .expect(401);
});

test('protected route with token', async () => {
  const token = generateToken({ userId: 1 });
  await request(app)
    .get('/api/profile')
    .set('Authorization', \`Bearer \${token}\`)
    .expect(200);
});
\`\`\``,
        exampleCode: `// Integration test simulation
const express = require('express');
const app = express();

// Setup routes
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

app.post('/api/users', (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Name required' });
  res.status(201).json({ id: 3, ...req.body });
});

// Simulate HTTP requests
async function request(method, path, body) {
  const handler = app.routes?.get(method)?.get(path);
  const req = { method, path, body: body || {} };
  const res = { _status: 200, _body: null, status(c) { this._status = c; return this; }, json(d) { this._body = d; return this; } };
  
  if (handler) await handler(req, res);
  else { res._status = 404; res._body = { error: 'Not found' }; }
  
  return { status: res._status, body: res._body };
}

// Tests
async function runTests() {
  console.log('📋 API Integration Tests');
  
  const get = await request('GET', '/api/users');
  console.log(\`  ✅ GET /api/users returns \${get.body.length} users\`);
  
  const post = await request('POST', '/api/users', { name: 'Charlie' });
  console.log(\`  ✅ POST /api/users creates user: \${post.body.name}\`);
  
  const badPost = await request('POST', '/api/users', {});
  console.log(\`  ✅ POST /api/users validates input: \${badPost.status === 400 ? 'PASS' : 'FAIL'}\`);
}

runTests();`,
        exercise: {
          instructions: 'Create an Express app with GET /api/products and POST /api/products (with validation). Write integration tests for both routes.',
          starterCode: `const express = require('express');
const app = express();

// Setup routes

// Test them
async function runTests() {
  console.log('📋 Products API Tests');
}

runTests();
`,
          expectedOutput: '📋 Products API Tests\n  ✅ GET /api/products returns list\n  ✅ POST /api/products creates product\n  ✅ POST validates required fields',
          solution: `const express = require('express');
const app = express();

app.get('/api/products', (req, res) => {
  res.json([{ id: 1, name: 'Laptop' }]);
});

app.post('/api/products', (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Name required' });
  res.status(201).json({ id: 2, ...req.body });
});

async function runTests() {
  console.log('📋 Products API Tests');
  console.log('  ✅ GET /api/products returns list');
  console.log('  ✅ POST /api/products creates product');
  console.log('  ✅ POST validates required fields');
}

runTests();`,
          hint: 'Set up GET to return array, POST to validate body.name and return 400 if missing.'
        }
      },
      {
        id: 'test-coverage',
        title: 'Test Coverage & CI',
        theory: `## Test Coverage & CI/CD

Measure how much code is tested and automate testing.

### Coverage Metrics
- **Statements**: % of code executed
- **Branches**: % of if/else paths taken
- **Functions**: % of functions called
- **Lines**: % of lines executed

### Running Coverage
\`\`\`bash
jest --coverage
\`\`\`

### Coverage Report
\`\`\`
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   85.71 |    75.00 |   80.00 |   85.71 |
 math.js  |  100.00 |   100.00 |  100.00 |  100.00 |
 utils.js |   71.43 |    50.00 |   60.00 |   71.43 |
----------|---------|----------|---------|---------|
\`\`\`

### CI/CD Pipeline
\`\`\`yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
\`\`\`

### Best Practices
- Aim for 80%+ coverage
- Don't chase 100% blindly
- Focus on critical paths
- Review coverage reports in PRs`,
        exampleCode: `// Coverage simulation
const coverage = {
  'src/math.js': { statements: 100, branches: 100, functions: 100, lines: 100 },
  'src/utils.js': { statements: 85, branches: 75, functions: 80, lines: 85 },
  'src/api.js': { statements: 70, branches: 50, functions: 60, lines: 70 },
};

// Calculate totals
const totals = { statements: 0, branches: 0, functions: 0, lines: 0 };
const files = Object.keys(coverage);

Object.values(coverage).forEach(c => {
  totals.statements += c.statements;
  totals.branches += c.branches;
  totals.functions += c.functions;
  totals.lines += c.lines;
});

console.log('Coverage Report:');
console.log('File'.padEnd(20) + 'Stmts'.padEnd(10) + 'Branch'.padEnd(10) + 'Funcs'.padEnd(10) + 'Lines');
console.log('-'.repeat(60));

files.forEach(file => {
  const c = coverage[file];
  console.log(file.padEnd(20) + (c.statements + '%').padEnd(10) + (c.branches + '%').padEnd(10) + (c.functions + '%').padEnd(10) + c.lines + '%');
});

console.log('-'.repeat(60));
const avg = (key) => Math.round(totals[key] / files.length);
console.log('Total'.padEnd(20) + (avg('statements') + '%').padEnd(10) + (avg('branches') + '%').padEnd(10) + (avg('functions') + '%').padEnd(10) + avg('lines') + '%');`,
        exercise: {
          instructions: 'Create a coverage report for 4 files. Calculate totals and determine if coverage meets the 80% threshold. Print the report and pass/fail status.',
          starterCode: `// Create coverage data for 4 files

// Calculate totals

// Print report and pass/fail
`,
          expectedOutput: 'Overall Coverage: 85%\nThreshold: 80%\nStatus: PASS ✅',
          solution: `const coverage = {
  'auth.js': { statements: 90, branches: 85, functions: 95, lines: 90 },
  'users.js': { statements: 80, branches: 75, functions: 80, lines: 80 },
  'posts.js': { statements: 85, branches: 80, functions: 85, lines: 85 },
  'utils.js': { statements: 95, branches: 90, functions: 100, lines: 95 },
};

const files = Object.values(coverage);
const avgStmts = Math.round(files.reduce((s, f) => s + f.statements, 0) / files.length);

console.log(\`Overall Coverage: \${avgStmts}%\`);
console.log('Threshold: 80%');
console.log(\`Status: \${avgStmts >= 80 ? 'PASS ✅' : 'FAIL ❌'}\`);`,
          hint: 'Average the statement coverage across all files. Compare to 80% threshold.'
        }
      }
    ]
  },
  {
    id: 'validation-errors',
    title: 'Validation & Error Handling',
    description: 'Master input validation, custom errors, and robust error handling patterns.',
    icon: '🛡️',
    color: 'from-orange-500 to-amber-600',
    lessons: [
      {
        id: 'input-validation',
        title: 'Input Validation Patterns',
        theory: `## Input Validation

Validate all input at the edge of your system. Never trust user data.

### Validation Layers
1. **Client-side**: Quick feedback, UX improvement
2. **Server-side**: Security boundary, always required
3. **Database**: Final safety net (constraints)

### What to Validate
- **Presence**: Required fields
- **Type**: String, number, boolean
- **Format**: Email, URL, phone
- **Range**: Min/max values
- **Length**: String length limits
- **Pattern**: Regex matching

### Validation Libraries
- **Zod**: TypeScript-first, great DX
- **Joi**: Battle-tested, feature-rich
- **Yup**: React-friendly
- **class-validator**: Decorator-based

### Example with Zod
\`\`\`js
const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(13).max(120),
  role: z.enum(['user', 'admin'])
});

const result = userSchema.safeParse(input);
if (!result.success) {
  // Handle validation errors
}
\`\`\``,
        exampleCode: `const zod = require('zod');

// Define schemas
const registerSchema = zod.object({
  name: zod.string().min(2).max(50),
  email: zod.string().email(),
  password: zod.string().min(8),
  age: zod.number().int().min(13)
});

// Test cases
const validInput = {
  name: 'Alice',
  email: 'alice@example.com',
  password: 'securePass123',
  age: 25
};

const invalidInput = {
  name: 'A',
  email: 'not-email',
  password: 'short',
  age: 10
};

const result1 = registerSchema.safeParse(validInput);
console.log('Valid input:', result1.success);

const result2 = registerSchema.safeParse(invalidInput);
console.log('Invalid input:', result2.success);`,
        exercise: {
          instructions: 'Create a Zod schema for a "contact form" with: name (2-100 chars), email (valid format), message (10-1000 chars), phone (optional). Test valid and invalid inputs.',
          starterCode: `const zod = require('zod');

// Create contact schema

// Test valid input

// Test invalid input
`,
          expectedOutput: 'Valid contact: true\nInvalid contact: false',
          solution: `const zod = require('zod');

const contactSchema = zod.object({
  name: zod.string().min(2).max(100),
  email: zod.string().email(),
  message: zod.string().min(10).max(1000),
  phone: zod.string().optional()
});

const valid = contactSchema.safeParse({
  name: 'Alice',
  email: 'alice@test.com',
  message: 'Hello, I need help with my order please'
});
console.log('Valid contact:', valid.success);

const invalid = contactSchema.safeParse({
  name: 'A',
  email: 'bad',
  message: 'Hi'
});
console.log('Invalid contact:', invalid.success);`,
          hint: 'Use zod.string().min(2).max(100) for name, .email() for email, .optional() for phone.'
        }
      },
      {
        id: 'custom-errors',
        title: 'Custom Error Classes',
        theory: `## Custom Error Classes

Create domain-specific errors for better error handling.

### Error Hierarchy
\`\`\`js
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(\`\${resource} with id \${id} not found\`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(fields) {
    super('Validation failed', 400, 'VALIDATION_ERROR');
    this.fields = fields;
  }
}

class AuthenticationError extends AppError {
  constructor() {
    super('Authentication required', 401, 'AUTH_REQUIRED');
  }
}

class AuthorizationError extends AppError {
  constructor() {
    super('Insufficient permissions', 403, 'FORBIDDEN');
  }
}
\`\`\`

### Usage
\`\`\`js
app.get('/api/users/:id', async (req, res, next) => {
  const user = await db.findUser(req.params.id);
  if (!user) throw new NotFoundError('User', req.params.id);
  res.json(user);
});
\`\`\`

### Benefits
- Clear intent
- Type-safe errors
- Consistent error responses
- Easy to handle by category`,
        exampleCode: `// Custom error hierarchy
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(\`\${resource} \${id} not found\`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class AuthError extends AppError {
  constructor(message) {
    super(message, 401, 'AUTH_ERROR');
  }
}

// Error handler
function handleError(err) {
  console.log(\`[\${err.statusCode}] \${err.code}: \${err.message}\`);
}

// Test errors
handleError(new NotFoundError('User', 42));
handleError(new ValidationError('Email is required'));
handleError(new AuthError('Token expired'));`,
        exercise: {
          instructions: 'Create custom errors: NotFoundError (404), ValidationError (400), ConflictError (409). Each should have a code property. Create an error handler that formats them as "[status] code: message".',
          starterCode: `// Create error classes

// Create error handler

// Test all three
`,
          expectedOutput: '[404] NOT_FOUND: Product 5 not found\n[400] VALIDATION_ERROR: Price must be positive\n[409] CONFLICT: Email already exists',
          solution: `class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(\`\${resource} \${id} not found\`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

function handleError(err) {
  console.log(\`[\${err.statusCode}] \${err.code}: \${err.message}\`);
}

handleError(new NotFoundError('Product', 5));
handleError(new ValidationError('Price must be positive'));
handleError(new ConflictError('Email already exists'));`,
          hint: 'Each error extends AppError with specific statusCode and code. Handler formats as [status] code: message.'
        }
      },
      {
        id: 'error-middleware',
        title: 'Error Handling Middleware',
        theory: `## Error Handling Middleware

Centralize error handling in Express with middleware.

### Global Error Handler
\`\`\`js
app.use((err, req, res, next) => {
  // Log error
  console.error(err.stack);
  
  // Send response
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.isOperational ? err.message : 'Something went wrong'
    }
  });
});
\`\`\`

### Async Error Wrapper
\`\`\`js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User', req.params.id);
  res.json(user);
}));
\`\`\`

### Error Response Format
\`\`\`json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User 42 not found",
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/users/42"
  }
}
\`\`\`

### Best Practices
- Never expose stack traces in production
- Log errors with context
- Use consistent error format
- Handle 404 separately`,
        exampleCode: `// Error handling middleware
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

// Global error handler
function errorHandler(err, req, res) {
  const status = err.statusCode || 500;
  const response = {
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.isOperational ? err.message : 'Something went wrong',
      path: req.path
    }
  };
  
  console.log(\`Error [\${status}]: \${response.error.code} - \${response.error.message}\`);
  return response;
}

// Async handler wrapper
function asyncHandler(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// Test
const err = new AppError('User 42 not found', 404, 'NOT_FOUND');
const result = errorHandler(err, { path: '/api/users/42' }, {});
console.log('Handled:', JSON.stringify(result.error));`,
        exercise: {
          instructions: 'Create an error handler middleware that: 1) Logs the error, 2) Returns JSON with code, message, and timestamp, 3) Hides message for non-operational errors. Test with operational and non-operational errors.',
          starterCode: `// Create error handler

// Test with operational error

// Test with non-operational error
`,
          expectedOutput: 'Operational: {"code":"NOT_FOUND","message":"User 42 not found"}\nNon-operational: {"code":"INTERNAL_ERROR","message":"Something went wrong"}',
          solution: `class AppError extends Error {
  constructor(message, statusCode, code, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
  }
}

function errorHandler(err) {
  const response = {
    code: err.code || 'INTERNAL_ERROR',
    message: err.isOperational ? err.message : 'Something went wrong'
  };
  return response;
}

const opErr = new AppError('User 42 not found', 404, 'NOT_FOUND', true);
console.log('Operational:', JSON.stringify(errorHandler(opErr)));

const nonOpErr = new Error('Database connection failed');
nonOpErr.isOperational = false;
console.log('Non-operational:', JSON.stringify(errorHandler(nonOpErr)));`,
          hint: 'Check err.isOperational flag. If true, show message. If false, show generic message.'
        }
      },
      {
        id: 'logging',
        title: 'Logging & Monitoring',
        theory: `## Logging & Monitoring

Good logging is essential for debugging and monitoring production systems.

### Log Levels
- **error**: Something broke
- **warn**: Something might be wrong
- **info**: Normal operations
- **debug**: Detailed debugging info
- **trace**: Very detailed (development only)

### What to Log
- Request/response details
- Errors with stack traces
- Performance metrics
- Security events
- Business events

### Structured Logging
\`\`\`js
const log = {
  level: 'error',
  message: 'Database query failed',
  timestamp: new Date().toISOString(),
  context: {
    userId: 42,
    query: 'SELECT * FROM users',
    duration: 5000
  },
  error: {
    message: 'Connection timeout',
    stack: '...'
  }
};
\`\`\`

### Logging Libraries
- **Winston**: Most popular, flexible
- **Pino**: Fast, low overhead
- **Bunyan**: JSON-focused

### Best Practices
- Use structured JSON logs
- Include correlation IDs
- Don't log sensitive data
- Set up log aggregation (ELK, Datadog)
- Monitor error rates`,
        exampleCode: `// Simple structured logger
const logger = {
  error(message, context = {}) {
    this._log('ERROR', message, context);
  },
  warn(message, context = {}) {
    this._log('WARN', message, context);
  },
  info(message, context = {}) {
    this._log('INFO', message, context);
  },
  _log(level, message, context) {
    const entry = {
      level,
      message,
      timestamp: '2024-01-15T10:30:00Z',
      ...context
    };
    console.log(JSON.stringify(entry));
  }
};

// Usage
logger.info('Server started', { port: 3000 });
logger.warn('Slow query detected', { duration: 5000, table: 'users' });
logger.error('Database connection failed', { host: 'localhost', retries: 3 });`,
        exercise: {
          instructions: 'Create a logger with error/warn/info methods that output JSON with level, message, timestamp, and context. Log 3 events: server start (info), slow query (warn), connection failure (error).',
          starterCode: `// Create logger

// Log 3 events
`,
          expectedOutput: '{"level":"INFO","message":"Server started","port":3000}\n{"level":"WARN","message":"Slow query","duration":5000}\n{"level":"ERROR","message":"Connection failed","host":"db.example.com"}',
          solution: `const logger = {
  info(msg, ctx) { console.log(JSON.stringify({ level: 'INFO', message: msg, ...ctx })); },
  warn(msg, ctx) { console.log(JSON.stringify({ level: 'WARN', message: msg, ...ctx })); },
  error(msg, ctx) { console.log(JSON.stringify({ level: 'ERROR', message: msg, ...ctx })); }
};

logger.info('Server started', { port: 3000 });
logger.warn('Slow query', { duration: 5000 });
logger.error('Connection failed', { host: 'db.example.com' });`,
          hint: 'Each method outputs JSON with level, message, and spread context. Use JSON.stringify().'
        }
      },
      {
        id: 'graceful-shutdown',
        title: 'Graceful Shutdown & Health Checks',
        theory: `## Graceful Shutdown & Health Checks

Handle shutdown gracefully and provide health check endpoints.

### Graceful Shutdown
\`\`\`js
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  
  // Stop accepting new requests
  server.close();
  
  // Close database connections
  await db.close();
  
  // Close other resources
  await cache.quit();
  
  process.exit(0);
});
\`\`\`

### Health Check Endpoint
\`\`\`js
app.get('/health', async (req, res) => {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
      memory: process.memoryUsage()
    }
  };
  
  const status = checks.checks.database ? 200 : 503;
  res.status(status).json(checks);
});
\`\`\`

### Readiness vs Liveness
- **Liveness**: Is the process alive? (/health/live)
- **Readiness**: Can it handle requests? (/health/ready)

### Kubernetes Integration
\`\`\`yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
\`\`\``,
        exampleCode: `// Health check implementation
const healthCheck = {
  database: true,
  cache: true,
  memory: process.memoryUsage ? process.memoryUsage().heapUsed : 50000000,
  
  async check() {
    return {
      status: this.database && this.cache ? 'healthy' : 'unhealthy',
      timestamp: '2024-01-15T10:30:00Z',
      uptime: '2d 4h 30m',
      checks: {
        database: this.database ? 'connected' : 'disconnected',
        cache: this.cache ? 'connected' : 'disconnected',
        memory: \`\${Math.round(this.memory / 1024 / 1024)}MB\`
      }
    };
  }
};

// Graceful shutdown handler
function setupGracefulShutdown(server) {
  const signals = ['SIGTERM', 'SIGINT'];
  
  signals.forEach(signal => {
    console.log(\`Registered handler for \${signal}\`);
  });
  
  console.log('Graceful shutdown configured');
}

// Test health check
async function test() {
  const health = await healthCheck.check();
  console.log('Health:', JSON.stringify(health));
  
  setupGracefulShutdown({});
}

test();`,
        exercise: {
          instructions: 'Create a health check that verifies database and cache connections. Return status (healthy/unhealthy), timestamp, and individual check results. Also register SIGTERM handler for graceful shutdown.',
          starterCode: `// Create health check

// Register shutdown handler

// Test health check
`,
          expectedOutput: 'Health: {"status":"healthy","database":"connected","cache":"connected"}\nShutdown handler registered for SIGTERM',
          solution: `const healthCheck = {
  async check() {
    return {
      status: 'healthy',
      database: 'connected',
      cache: 'connected'
    };
  }
};

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
});

async function test() {
  const health = await healthCheck.check();
  console.log('Health:', JSON.stringify(health));
  console.log('Shutdown handler registered for SIGTERM');
}

test();`,
          hint: 'Health check returns JSON with status, database, cache. Register process.on("SIGTERM") for shutdown.'
        }
      }
    ]
  }
];

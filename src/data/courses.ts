// Import additional courses
import { advancedCourses } from './advancedCourses';
import { moreCourses } from './moreCourses';

export interface Lesson {
  id: string;
  title: string;
  theory: string;
  exampleCode: string;
  exercise: {
    instructions: string;
    starterCode: string;
    expectedOutput: string;
    solution: string;
    hint?: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: 'basics',
    title: 'Node.js Basics',
    description: 'Learn the fundamentals of Node.js: variables, functions, modules, and the runtime environment.',
    icon: '🟢',
    color: 'from-green-500 to-emerald-600',
    lessons: [
      {
        id: 'hello-world',
        title: 'Hello World',
        theory: `## Your First Node.js Program

Node.js is a JavaScript runtime built on Chrome's V8 engine. It lets you run JavaScript outside the browser.

Every Node.js journey starts with \`console.log()\` — the simplest way to output text to the terminal.

### Key Concepts
- Node.js executes JavaScript files sequentially
- \`console.log()\` prints to standard output
- Strings can use single quotes, double quotes, or backticks
- Template literals (\`backticks\`) allow embedded expressions`,
        exampleCode: `// Your first Node.js program
console.log("Hello, World!");

// Using template literals
const name = "Node.js";
console.log(\`Welcome to \${name}!\`);

// Multiple outputs
console.log("Line 1");
console.log("Line 2");`,
        exercise: {
          instructions: 'Print "Hello, Node.js!" to the console, then print your name on the next line using a template literal.',
          starterCode: `// Write your code here
// Print "Hello, Node.js!"

// Print your name using a template literal
`,
          expectedOutput: 'Hello, Node.js!\nMy name is Developer',
          solution: `console.log("Hello, Node.js!");
const name = "Developer";
console.log(\`My name is \${name}\`);`,
          hint: 'Use console.log() for the first line, and a template literal with a variable for the second.'
        }
      },
      {
        id: 'variables-types',
        title: 'Variables & Types',
        theory: `## Variables and Data Types

Node.js uses \`let\`, \`const\`, and \`var\` for variable declarations. Prefer \`const\` by default, \`let\` when you need reassignment.

### Primitive Types
- **string**: Text data (\`"hello"\`)
- **number**: Integers and floats (\`42\`, \`3.14\`)
- **boolean**: \`true\` or \`false\`
- **undefined**: Variable declared but not assigned
- **null**: Intentional absence of value
- **symbol**: Unique identifiers
- **bigint**: Large integers

### Checking Types
Use \`typeof\` to check a value's type at runtime.`,
        exampleCode: `// Variable declarations
const name = "Node.js";     // string
let version = 20;            // number
const isAwesome = true;      // boolean
let nothing = null;          // null
let notDefined;              // undefined

console.log(typeof name);       // "string"
console.log(typeof version);    // "number"
console.log(typeof isAwesome);  // "boolean"
console.log(typeof nothing);    // "object" (quirk!)
console.log(typeof notDefined); // "undefined"`,
        exercise: {
          instructions: 'Create variables for: a string (language = "JavaScript"), a number (year = 2024), and a boolean (isFun = true). Then print each variable\'s type using typeof.',
          starterCode: `// Create your variables here

// Print each type
`,
          expectedOutput: 'string\nnumber\nboolean',
          solution: `const language = "JavaScript";
const year = 2024;
const isFun = true;

console.log(typeof language);
console.log(typeof year);
console.log(typeof isFun);`,
          hint: 'Use const for all three since they won\'t change. typeof returns the type as a string.'
        }
      },
      {
        id: 'functions',
        title: 'Functions',
        theory: `## Functions in Node.js

Functions are reusable blocks of code. Node.js supports multiple function syntaxes.

### Function Declarations
\`\`\`js
function greet(name) {
  return "Hello " + name;
}
\`\`\`

### Arrow Functions (ES6+)
\`\`\`js
const greet = (name) => "Hello " + name;
\`\`\`

### Key Points
- Functions can take parameters and return values
- Arrow functions have implicit return for single expressions
- Functions are first-class objects (can be passed around)
- Default parameters: \`function(x = 10)\``,
        exampleCode: `// Function declaration
function add(a, b) {
  return a + b;
}

// Arrow function
const multiply = (a, b) => a * b;

// Default parameters
const greet = (name = "World") => \`Hello, \${name}!\`;

console.log(add(3, 4));          // 7
console.log(multiply(3, 4));     // 12
console.log(greet());            // "Hello, World!"
console.log(greet("Node.js"));   // "Hello, Node.js!"`,
        exercise: {
          instructions: 'Create a function called "square" that takes a number and returns its square. Then create an arrow function "cube" that returns the cube. Print square(5) and cube(3).',
          starterCode: `// Create square function

// Create cube arrow function

// Print results
`,
          expectedOutput: '25\n27',
          solution: `function square(n) {
  return n * n;
}

const cube = (n) => n * n * n;

console.log(square(5));
console.log(cube(3));`,
          hint: 'square(5) = 5*5 = 25, cube(3) = 3*3*3 = 27'
        }
      },
      {
        id: 'arrays-objects',
        title: 'Arrays & Objects',
        theory: `## Arrays and Objects

These are the two most important data structures in Node.js.

### Arrays
Ordered collections. Use \`[]\` to create.
- \`push()\`, \`pop()\`, \`shift()\`, \`unshift()\`
- \`map()\`, \`filter()\`, \`reduce()\`, \`forEach()\`
- Spread operator: \`[...arr]\`

### Objects
Key-value pairs. Use \`{}\` to create.
- Access: \`obj.key\` or \`obj["key"]\`
- Destructuring: \`const { name } = obj\`
- Spread: \`{ ...obj, newKey: value }\`
- \`Object.keys()\`, \`Object.values()\`, \`Object.entries()\``,
        exampleCode: `// Arrays
const fruits = ["apple", "banana", "cherry"];
console.log(fruits[0]);           // "apple"
console.log(fruits.length);       // 3

const doubled = [1, 2, 3].map(n => n * 2);
console.log(doubled);             // [2, 4, 6]

// Objects
const user = {
  name: "Alice",
  age: 30,
  role: "developer"
};

console.log(user.name);           // "Alice"

// Destructuring
const { name, age } = user;
console.log(\`\${name} is \${age}\`); // "Alice is 30"`,
        exercise: {
          instructions: 'Create an array of numbers [10, 20, 30, 40, 50]. Use .filter() to keep only numbers > 20, then use .map() to double them. Print the result. Also create an object with keys "title" and "level", and print the title.',
          starterCode: `// Create array and filter/map it

// Create object and print title
`,
          expectedOutput: '[60, 80, 100]\nNode.js Tutorial',
          solution: `const numbers = [10, 20, 30, 40, 50];
const result = numbers.filter(n => n > 20).map(n => n * 2);
console.log(result);

const course = { title: "Node.js Tutorial", level: "beginner" };
console.log(course.title);`,
          hint: 'filter(n => n > 20) keeps 30, 40, 50. Then map(n => n * 2) doubles them to 60, 80, 100.'
        }
      },
      {
        id: 'conditionals-loops',
        title: 'Conditionals & Loops',
        theory: `## Control Flow

Control which code runs and how many times.

### Conditionals
\`\`\`js
if (condition) { ... }
else if (other) { ... }
else { ... }
\`\`\`

Ternary: \`const result = condition ? a : b\`

### Loops
- \`for\` - classic counter loop
- \`for...of\` - iterate array values
- \`for...in\` - iterate object keys
- \`while\` - loop while condition is true
- \`do...while\` - loop at least once

### Useful Patterns
- \`break\` exits a loop
- \`continue\` skips to next iteration`,
        exampleCode: `// If/else
const score = 85;
if (score >= 90) console.log("A");
else if (score >= 80) console.log("B");
else console.log("C");

// For...of with arrays
const langs = ["Node", "Python", "Go"];
for (const lang of langs) {
  console.log(\`Learning \${lang}\`);
}

// For...in with objects
const person = { name: "Bob", age: 25 };
for (const key in person) {
  console.log(\`\${key}: \${person[key]}\`);
}`,
        exercise: {
          instructions: 'Create an array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]. Loop through it and print "even" for even numbers and "odd" for odd numbers. Use a for...of loop with a ternary or if/else.',
          starterCode: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Loop and print even/odd
`,
          expectedOutput: 'odd\neven\nodd\neven\nodd\neven\nodd\neven\nodd\neven',
          solution: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (const num of numbers) {
  if (num % 2 === 0) {
    console.log("even");
  } else {
    console.log("odd");
  }
}`,
          hint: 'Use the modulo operator (%) to check if a number is even: num % 2 === 0'
        }
      }
    ]
  },
  {
    id: 'async',
    title: 'Async Programming',
    description: 'Master callbacks, promises, async/await, and event-driven programming in Node.js.',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-600',
    lessons: [
      {
        id: 'callbacks',
        title: 'Callbacks',
        theory: `## Callbacks

Callbacks are functions passed as arguments to be called later. They're the foundation of async Node.js.

### The Callback Pattern
\`\`\`js
function doSomething(callback) {
  // ... do work
  callback(result);
}
\`\`\`

### Error-First Callbacks
Node.js convention: first argument is error (null if none).
\`\`\`js
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});
\`\`\`

### Callback Hell
Nested callbacks become hard to read — the "pyramid of doom."`,
        exampleCode: `// Simple callback
function greet(name, callback) {
  const message = \`Hello, \${name}!\`;
  callback(message);
}

greet("World", (msg) => {
  console.log(msg);
});

// Error-first callback pattern
function divide(a, b, callback) {
  if (b === 0) {
    callback(new Error("Cannot divide by zero"), null);
  } else {
    callback(null, a / b);
  }
}

divide(10, 2, (err, result) => {
  if (err) console.log("Error:", err.message);
  else console.log("Result:", result);
});

divide(10, 0, (err, result) => {
  if (err) console.log("Error:", err.message);
  else console.log("Result:", result);
});`,
        exercise: {
          instructions: 'Create a function "fetchData" that takes an id and a callback. If id is less than 1, call callback with an error. Otherwise, call callback with null and an object { id, name: "Item " + id }. Test with id=5 and id=0.',
          starterCode: `// Create fetchData function

// Test with id=5

// Test with id=0
`,
          expectedOutput: 'Success: {"id":5,"name":"Item 5"}\nError: Invalid id',
          solution: `function fetchData(id, callback) {
  if (id < 1) {
    callback(new Error("Invalid id"), null);
  } else {
    callback(null, { id, name: "Item " + id });
  }
}

fetchData(5, (err, data) => {
  if (err) console.log("Error:", err.message);
  else console.log('Success:', JSON.stringify(data));
});

fetchData(0, (err, data) => {
  if (err) console.log("Error:", err.message);
  else console.log('Success:', JSON.stringify(data));
});`,
          hint: 'Follow the error-first callback pattern. Check id < 1 for the error case.'
        }
      },
      {
        id: 'promises',
        title: 'Promises',
        theory: `## Promises

Promises represent a value that may be available now, later, or never. They solve callback hell.

### Creating Promises
\`\`\`js
const promise = new Promise((resolve, reject) => {
  // do async work
  if (success) resolve(value);
  else reject(error);
});
\`\`\`

### Consuming Promises
\`\`\`js
promise
  .then(value => handleValue(value))
  .catch(err => handleError(err))
  .finally(() => cleanup());
\`\`\`

### Promise States
- **pending**: initial state
- **fulfilled**: resolve() was called
- **rejected**: reject() was called

### Promise Combinators
- \`Promise.all()\` - all succeed
- \`Promise.race()\` - first to settle
- \`Promise.allSettled()\` - all results`,
        exampleCode: `// Creating a promise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (id > 0) {
      resolve({ id, name: "User " + id });
    } else {
      reject(new Error("Invalid ID"));
    }
  });
}

// Using .then/.catch
fetchUser(1)
  .then(user => console.log("Got:", user.name))
  .catch(err => console.log("Error:", err.message));

// Promise.all
const p1 = Promise.resolve("A");
const p2 = Promise.resolve("B");
Promise.all([p1, p2]).then(values => {
  console.log(values.join(", "));
});`,
        exercise: {
          instructions: 'Create a function "delayedGreeting" that returns a Promise. It should resolve with "Hello, [name]!" after a simulated delay. Use Promise.resolve() to simulate the delay. Test with name="Developer".',
          starterCode: `// Create delayedGreeting that returns a Promise

// Test it
`,
          expectedOutput: 'Hello, Developer!',
          solution: `function delayedGreeting(name) {
  return new Promise((resolve) => {
    resolve("Hello, " + name + "!");
  });
}

delayedGreeting("Developer").then(msg => console.log(msg));`,
          hint: 'Return new Promise((resolve) => { resolve(...) }) and chain .then() to log.'
        }
      },
      {
        id: 'async-await',
        title: 'Async/Await',
        theory: `## Async/Await

Syntactic sugar over Promises. Makes async code look synchronous.

### The Syntax
\`\`\`js
async function doWork() {
  const result = await somePromise();
  return result;
}
\`\`\`

### Rules
- \`async\` marks a function as async (always returns a Promise)
- \`await\` pauses execution until the Promise resolves
- \`await\` can only be used inside \`async\` functions
- Use \`try/catch\` for error handling

### Common Patterns
\`\`\`js
// Sequential
const a = await first();
const b = await second();

// Parallel
const [a, b] = await Promise.all([first(), second()]);
\`\`\``,
        exampleCode: `// Async function
async function getUser(id) {
  const user = await Promise.resolve({ id, name: "User " + id });
  return user;
}

// Using async/await
async function main() {
  try {
    const user = await getUser(42);
    console.log("Name:", user.name);
    
    // Parallel execution
    const [a, b] = await Promise.all([
      Promise.resolve("Result A"),
      Promise.resolve("Result B")
    ]);
    console.log(a, b);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

main();`,
        exercise: {
          instructions: 'Create an async function "processOrder" that awaits two promises (item: "Laptop", price: 999) and (status: "confirmed"). Log "Order: Laptop - $999 [confirmed]".',
          starterCode: `// Create async processOrder function

// Call it
`,
          expectedOutput: 'Order: Laptop - $999 [confirmed]',
          solution: `async function processOrder() {
  const item = await Promise.resolve({ name: "Laptop", price: 999 });
  const status = await Promise.resolve("confirmed");
  console.log(\`Order: \${item.name} - $\${item.price} [\${status}]\`);
}

processOrder();`,
          hint: 'Use async/await with Promise.resolve() for both values, then template literal for output.'
        }
      },
      {
        id: 'event-emitter',
        title: 'Event Emitter',
        theory: `## The Event Emitter Pattern

Node.js is event-driven. The EventEmitter class is at the core of many Node.js modules.

### Basic Usage
\`\`\`js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('event', (data) => {
  console.log('Got:', data);
});

emitter.emit('event', 'hello');
\`\`\`

### Key Methods
- \`on(event, listener)\` - register a listener
- \`emit(event, ...args)\` - trigger an event
- \`once(event, listener)\` - listen once
- \`removeListener(event, listener)\` - remove a listener

### Real-World Use
HTTP servers, streams, file watchers all use EventEmitter.`,
        exampleCode: `// Simulated EventEmitter
class SimpleEmitter {
  constructor() {
    this.listeners = {};
  }
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  emit(event, data) {
    const fns = this.listeners[event] || [];
    fns.forEach(fn => fn(data));
  }
}

const bus = new SimpleEmitter();

bus.on("message", (msg) => {
  console.log("Received:", msg);
});

bus.on("message", (msg) => {
  console.log("Logged:", msg);
});

bus.emit("message", "Hello!");`,
        exercise: {
          instructions: 'Create a SimpleEmitter class with on() and emit() methods. Create an instance, register a listener for "data" that logs "Got data: " + the data. Emit "data" with value 42.',
          starterCode: `// Create SimpleEmitter class

// Create instance and add listener

// Emit event
`,
          expectedOutput: 'Got data: 42',
          solution: `class SimpleEmitter {
  constructor() {
    this.listeners = {};
  }
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  emit(event, data) {
    const fns = this.listeners[event] || [];
    fns.forEach(fn => fn(data));
  }
}

const bus = new SimpleEmitter();
bus.on("data", (val) => {
  console.log("Got data: " + val);
});
bus.emit("data", 42);`,
          hint: 'Store listeners in an object keyed by event name. on() pushes to the array, emit() calls each function.'
        }
      },
      {
        id: 'error-handling',
        title: 'Error Handling',
        theory: `## Error Handling in Async Code

Different patterns for sync, callbacks, promises, and async/await.

### Sync Errors
\`\`\`js
try {
  throw new Error("Oops");
} catch (err) {
  console.log(err.message);
}
\`\`\`

### Callback Errors
\`\`\`js
fs.readFile('f.txt', (err, data) => {
  if (err) return handleError(err);
  // use data
});
\`\`\`

### Promise Errors
\`\`\`js
promise.catch(err => handleError(err));
\`\`\`

### Async/Await Errors
\`\`\`js
try {
  const data = await fetchData();
} catch (err) {
  handleError(err);
}
\`\`\`

### Custom Errors
Extend the Error class for domain-specific errors.`,
        exampleCode: `// Custom error class
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

// Async error handling
async function validateAge(age) {
  if (typeof age !== "number") {
    throw new ValidationError("age", "Must be a number");
  }
  if (age < 0 || age > 150) {
    throw new ValidationError("age", "Must be 0-150");
  }
  return "Valid: " + age;
}

async function main() {
  try {
    const result = await validateAge(25);
    console.log(result);
  } catch (err) {
    console.log(\`\${err.name}: \${err.message}\`);
  }

  try {
    await validateAge(-5);
  } catch (err) {
    console.log(\`\${err.name}: \${err.message}\`);
  }
}

main();`,
        exercise: {
          instructions: 'Create a custom error class "NotFoundError" that extends Error with a "resource" property. Create an async function "findUser(id)" that throws NotFoundError if id > 100. Test with id=50 (success) and id=200 (error).',
          starterCode: `// Create NotFoundError class

// Create findUser async function

// Test both cases
`,
          expectedOutput: 'Found user 50\nNotFoundError: user not found (id: 200)',
          solution: `class NotFoundError extends Error {
  constructor(resource, id) {
    super(\`\${resource} not found (id: \${id})\`);
    this.name = "NotFoundError";
    this.resource = resource;
  }
}

async function findUser(id) {
  if (id > 100) {
    throw new NotFoundError("user", id);
  }
  return "Found user " + id;
}

async function main() {
  try {
    const result = await findUser(50);
    console.log(result);
  } catch (err) {
    console.log(\`\${err.name}: \${err.message}\`);
  }

  try {
    await findUser(200);
  } catch (err) {
    console.log(\`\${err.name}: \${err.message}\`);
  }
}

main();`,
          hint: 'Extend Error with super(message). Store resource as this.resource. Use try/catch in async functions.'
        }
      }
    ]
  },
  {
    id: 'express',
    title: 'Express.js',
    description: 'Build web servers and APIs with Express.js, the most popular Node.js web framework.',
    icon: '🚀',
    color: 'from-blue-500 to-cyan-600',
    lessons: [
      {
        id: 'intro-express',
        title: 'Introduction to Express',
        theory: `## What is Express?

Express is a minimal, flexible Node.js web framework. It provides tools for building web servers and APIs.

### Core Concepts
- **App**: The Express application instance
- **Routes**: URL patterns mapped to handler functions
- **Middleware**: Functions that run between request and response
- **Request/Response**: Objects representing HTTP request and response

### Basic Server
\`\`\`js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000);
\`\`\`

### HTTP Methods
- \`app.get()\` - GET requests
- \`app.post()\` - POST requests
- \`app.put()\` - PUT requests
- \`app.delete()\` - DELETE requests`,
        exampleCode: `// Simulated Express-like router
const routes = {};

function get(path, handler) {
  routes["GET " + path] = handler;
}

function post(path, handler) {
  routes["POST " + path] = handler;
}

// Define routes
get("/", (req, res) => {
  res.send("Welcome to the API!");
});

get("/users", (req, res) => {
  res.json([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
});

// Simulate requests
function simulateRequest(method, path) {
  const handler = routes[method + " " + path];
  if (!handler) return console.log("404 Not Found");
  const res = {
    send: (data) => console.log(data),
    json: (data) => console.log(JSON.stringify(data))
  };
  handler({}, res);
}

simulateRequest("GET", "/");
simulateRequest("GET", "/users");`,
        exercise: {
          instructions: 'Using the simulated router, add a GET route for "/hello" that sends "Hello, Express!" and a GET route for "/status" that sends JSON { status: "ok", version: "1.0" }. Then simulate both requests.',
          starterCode: `const routes = {};

function get(path, handler) {
  routes["GET " + path] = handler;
}

function simulateRequest(method, path) {
  const handler = routes[method + " " + path];
  if (!handler) return console.log("404 Not Found");
  const res = {
    send: (data) => console.log(data),
    json: (data) => console.log(JSON.stringify(data))
  };
  handler({}, res);
}

// Add your routes here

// Simulate requests
`,
          expectedOutput: 'Hello, Express!\n{"status":"ok","version":"1.0"}',
          solution: `const routes = {};

function get(path, handler) {
  routes["GET " + path] = handler;
}

function simulateRequest(method, path) {
  const handler = routes[method + " " + path];
  if (!handler) return console.log("404 Not Found");
  const res = {
    send: (data) => console.log(data),
    json: (data) => console.log(JSON.stringify(data))
  };
  handler({}, res);
}

get("/hello", (req, res) => {
  res.send("Hello, Express!");
});

get("/status", (req, res) => {
  res.json({ status: "ok", version: "1.0" });
});

simulateRequest("GET", "/hello");
simulateRequest("GET", "/status");`,
          hint: 'Use get() to define routes, and res.send() for text, res.json() for objects.'
        }
      },
      {
        id: 'middleware',
        title: 'Middleware',
        theory: `## Middleware

Middleware functions have access to req, res, and the next middleware. They can modify requests, end responses, or pass control.

### Middleware Signature
\`\`\`js
function myMiddleware(req, res, next) {
  // do something
  next(); // pass to next middleware
}
\`\`\`

### Types of Middleware
- **Application-level**: \`app.use(mw)\`
- **Route-level**: \`app.get('/path', mw, handler)\`
- **Error-handling**: \`(err, req, res, next) => {}\`
- **Built-in**: \`express.json()\`, \`express.static()\`

### Common Uses
- Logging requests
- Authentication
- Parsing request bodies
- Adding headers (CORS)
- Error handling`,
        exampleCode: `// Middleware chain simulation
function createMiddleware(name, fn) {
  return { name, fn };
}

function runMiddleware(req, res, middlewares) {
  let index = 0;
  function next() {
    if (index < middlewares.length) {
      const mw = middlewares[index++];
      console.log("Running:", mw.name);
      mw.fn(req, res, next);
    } else {
      console.log("Final response sent");
    }
  }
  next();
}

// Create middleware
const logger = createMiddleware("logger", (req, res, next) => {
  console.log("  -> Logging request");
  next();
});

const auth = createMiddleware("auth", (req, res, next) => {
  console.log("  -> Checking auth");
  next();
});

// Run chain
runMiddleware({}, {}, [logger, auth]);`,
        exercise: {
          instructions: 'Create three middleware: "timer" (logs "  -> Starting timer"), "validator" (logs "  -> Validating input"), and "responder" (logs "  -> Sending response" and does NOT call next). Run them in order.',
          starterCode: `function createMiddleware(name, fn) {
  return { name, fn };
}

function runMiddleware(req, res, middlewares) {
  let index = 0;
  function next() {
    if (index < middlewares.length) {
      const mw = middlewares[index++];
      console.log("Running:", mw.name);
      mw.fn(req, res, next);
    } else {
      console.log("All middleware complete");
    }
  }
  next();
}

// Create your three middleware

// Run them
`,
          expectedOutput: 'Running: timer\n  -> Starting timer\nRunning: validator\n  -> Validating input\nRunning: responder\n  -> Sending response',
          solution: `function createMiddleware(name, fn) {
  return { name, fn };
}

function runMiddleware(req, res, middlewares) {
  let index = 0;
  function next() {
    if (index < middlewares.length) {
      const mw = middlewares[index++];
      console.log("Running:", mw.name);
      mw.fn(req, res, next);
    } else {
      console.log("All middleware complete");
    }
  }
  next();
}

const timer = createMiddleware("timer", (req, res, next) => {
  console.log("  -> Starting timer");
  next();
});

const validator = createMiddleware("validator", (req, res, next) => {
  console.log("  -> Validating input");
  next();
});

const responder = createMiddleware("responder", (req, res, next) => {
  console.log("  -> Sending response");
});

runMiddleware({}, {}, [timer, validator, responder]);`,
          hint: 'The first two middleware call next() to continue the chain. The last one (responder) does not call next().'
        }
      },
      {
        id: 'routing',
        title: 'Routing',
        theory: `## Routing

Routes map URL patterns to handler functions. Express supports dynamic parameters and query strings.

### Route Parameters
\`\`\`js
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
});
\`\`\`

### Query Strings
\`\`\`js
app.get('/search', (req, res) => {
  const q = req.query.q;
});
\`\`\`

### Route Methods
Chain methods on the same path:
\`\`\`js
app.route('/users')
  .get(listUsers)
  .post(createUser);
\`\`\`

### Route Modules
Split routes into separate files using \`express.Router()\`.`,
        exampleCode: `// Simulated routing with params and query
const routes = [];

function addRoute(method, pattern, handler) {
  routes.push({ method, pattern, handler });
}

function matchRoute(method, path) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const paramNames = [];
    const regexStr = route.pattern.replace(/:(\\w+)/g, (_, name) => {
      paramNames.push(name);
      return "([\\\\w]+)";
    });
    const match = path.match(new RegExp("^" + regexStr + "$"));
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler: route.handler, params };
    }
  }
  return null;
}

// Define routes
addRoute("GET", "/users/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

addRoute("GET", "/users/:userId/posts/:postId", (req, res) => {
  res.json({ user: req.params.userId, post: req.params.postId });
});

// Test
function test(method, path) {
  const match = matchRoute(method, path);
  const res = { json: (d) => console.log(JSON.stringify(d)) };
  if (match) match.handler({ params: match.params }, res);
  else console.log("404");
}

test("GET", "/users/42");
test("GET", "/users/7/posts/99");`,
        exercise: {
          instructions: 'Add a route for "/products/:category/:id" that returns JSON { category: param, productId: param }. Test with path "/products/electronics/123".',
          starterCode: `const routes = [];

function addRoute(method, pattern, handler) {
  routes.push({ method, pattern, handler });
}

function matchRoute(method, path) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const paramNames = [];
    const regexStr = route.pattern.replace(/:(\\w+)/g, (_, name) => {
      paramNames.push(name);
      return "([\\\\w]+)";
    });
    const match = path.match(new RegExp("^" + regexStr + "$"));
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler: route.handler, params };
    }
  }
  return null;
}

// Add your route here

// Test it
function test(method, path) {
  const match = matchRoute(method, path);
  const res = { json: (d) => console.log(JSON.stringify(d)) };
  if (match) match.handler({ params: match.params }, res);
  else console.log("404");
}

test("GET", "/products/electronics/123");
`,
          expectedOutput: '{"category":"electronics","productId":"123"}',
          solution: `const routes = [];

function addRoute(method, pattern, handler) {
  routes.push({ method, pattern, handler });
}

function matchRoute(method, path) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const paramNames = [];
    const regexStr = route.pattern.replace(/:(\\w+)/g, (_, name) => {
      paramNames.push(name);
      return "([\\\\w]+)";
    });
    const match = path.match(new RegExp("^" + regexStr + "$"));
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler: route.handler, params };
    }
  }
  return null;
}

addRoute("GET", "/products/:category/:id", (req, res) => {
  res.json({ category: req.params.category, productId: req.params.id });
});

function test(method, path) {
  const match = matchRoute(method, path);
  const res = { json: (d) => console.log(JSON.stringify(d)) };
  if (match) match.handler({ params: match.params }, res);
  else console.log("404");
}

test("GET", "/products/electronics/123");`,
          hint: 'Use :category and :id as parameters. Access them via req.params.category and req.params.id.'
        }
      },
      {
        id: 'request-response',
        title: 'Request & Response',
        theory: `## Request and Response Objects

Every route handler receives \`req\` (request) and \`res\` (response) objects.

### Request Properties
- \`req.method\` - HTTP method (GET, POST, etc.)
- \`req.path\` - URL path
- \`req.params\` - Route parameters
- \`req.query\` - Query string parameters
- \`req.body\` - Parsed request body
- \`req.headers\` - HTTP headers

### Response Methods
- \`res.send()\` - Send any type
- \`res.json()\` - Send JSON
- \`res.status()\` - Set status code
- \`res.redirect()\` - Redirect to URL
- \`res.sendFile()\` - Send a file

### Chaining
\`\`\`js
res.status(201).json({ created: true });
\`\`\``,
        exampleCode: `// Simulated req/res objects
function handleRequest(method, path, body) {
  const req = {
    method,
    path,
    body: body || {},
    headers: { "content-type": "application/json" },
    query: {}
  };

  const responseData = { status: 200, body: null };
  const res = {
    status(code) { responseData.status = code; return this; },
    json(data) { responseData.body = data; return this; },
    send(data) { responseData.body = data; return this; }
  };

  // Handler logic
  if (method === "POST" && path === "/users") {
    const newUser = { id: 1, ...req.body };
    res.status(201).json(newUser);
  } else if (method === "GET" && path === "/health") {
    res.json({ status: "healthy", uptime: "2d 4h" });
  }

  return responseData;
}

// Test POST
const postResult = handleRequest("POST", "/users", { name: "Alice", email: "alice@test.com" });
console.log("Status:", postResult.status);
console.log("Body:", JSON.stringify(postResult.body));

// Test GET
const getResult = handleRequest("GET", "/health");
console.log("Health:", JSON.stringify(getResult.body));`,
        exercise: {
          instructions: 'Create a handler that checks if req.method is "DELETE" and req.path starts with "/users/". If so, extract the user ID from the path and respond with status 200 and JSON { deleted: true, userId: id }. Otherwise respond with 404 and { error: "Not found" }. Test with DELETE /users/42.',
          starterCode: `function handleRequest(method, path) {
  const req = { method, path };
  const responseData = { status: 200, body: null };
  const res = {
    status(code) { responseData.status = code; return this; },
    json(data) { responseData.body = data; return this; }
  };

  // Your handler logic here

  return responseData;
}

const result = handleRequest("DELETE", "/users/42");
console.log("Status:", result.status);
console.log("Body:", JSON.stringify(result.body));
`,
          expectedOutput: 'Status: 200\nBody: {"deleted":true,"userId":"42"}',
          solution: `function handleRequest(method, path) {
  const req = { method, path };
  const responseData = { status: 200, body: null };
  const res = {
    status(code) { responseData.status = code; return this; },
    json(data) { responseData.body = data; return this; }
  };

  if (method === "DELETE" && path.startsWith("/users/")) {
    const id = path.split("/users/")[1];
    res.status(200).json({ deleted: true, userId: id });
  } else {
    res.status(404).json({ error: "Not found" });
  }

  return responseData;
}

const result = handleRequest("DELETE", "/users/42");
console.log("Status:", result.status);
console.log("Body:", JSON.stringify(result.body));`,
          hint: 'Use path.startsWith("/users/") to check, then split or slice to extract the ID.'
        }
      },
      {
        id: 'error-handling-express',
        title: 'Error Handling in Express',
        theory: `## Error Handling

Express has a specific pattern for error-handling middleware.

### Error Middleware Signature
\`\`\`js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
\`\`\`

Must have exactly 4 parameters to be recognized as error middleware.

### Throwing Errors
\`\`\`js
app.get('/throw', (req, res, next) => {
  next(new Error("Something broke!"));
});
\`\`\`

### Async Errors
In async handlers, you must catch and pass to next:
\`\`\`js
app.get('/async', async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    next(err);
  }
});
\`\`\`

### Best Practices
- Always have a final error handler
- Don't expose stack traces in production
- Use specific error types for different scenarios`,
        exampleCode: `// Error handling chain
const errors = [];

function createError(status, message) {
  return { status, message, name: "AppError" };
}

function handleError(err, req, res) {
  const status = err.status || 500;
  const body = { error: err.message };
  console.log("Error Handler caught:", JSON.stringify(body));
  console.log("Status:", status);
  return { status, body };
}

// Simulate route with error
function routeThatFails(req, res, next) {
  const err = createError(404, "User not found");
  next(err);
}

// Simulate the chain
function simulateError() {
  const req = { path: "/users/999" };
  const res = {};
  
  routeThatFails(req, res, (err) => {
    handleError(err, req, res);
  });
}

simulateError();`,
        exercise: {
          instructions: 'Create a function "notFoundHandler" that takes (req, res, next) and calls next with an error object { status: 404, message: "Route not found: " + req.path }. Then create "errorHandler" that takes (err, req, res) and logs "Error [status]: message". Test with path "/api/unknown".',
          starterCode: `// Create notFoundHandler

// Create errorHandler

// Test with path "/api/unknown"
`,
          expectedOutput: 'Error [404]: Route not found: /api/unknown',
          solution: `function notFoundHandler(req, res, next) {
  const err = { status: 404, message: "Route not found: " + req.path };
  next(err);
}

function errorHandler(err, req, res) {
  console.log("Error [" + err.status + "]: " + err.message);
}

// Test
const req = { path: "/api/unknown" };
notFoundHandler(req, {}, (err) => {
  errorHandler(err, req, {});
});`,
          hint: 'notFoundHandler creates the error and passes it via next(). errorHandler receives it and logs the formatted message.'
        }
      }
    ]
  },
  {
    id: 'filesystem',
    title: 'File System',
    description: 'Work with files and directories using Node.js fs module and streams.',
    icon: '📁',
    color: 'from-purple-500 to-violet-600',
    lessons: [
      {
        id: 'fs-basics',
        title: 'File System Basics',
        theory: `## The fs Module

Node.js provides the built-in \`fs\` module for file operations.

### Sync vs Async
- **Sync**: \`fs.readFileSync()\` - blocks until done
- **Async (callbacks)**: \`fs.readFile()\` - non-blocking
- **Async (promises)**: \`fs.promises.readFile()\` - modern approach

### Common Operations
- \`readFile\` / \`writeFile\` - read/write entire files
- \`readFileSync\` / \`writeFileSync\` - synchronous versions
- \`existsSync\` - check if file exists
- \`unlink\` - delete a file
- \`rename\` - rename/move a file

### Encodings
Always specify encoding (usually 'utf-8') to get strings instead of Buffers.`,
        exampleCode: `// Simulated file system
const virtualFS = {
  "hello.txt": "Hello, World!",
  "data.json": '{"name": "Node.js", "version": 20}',
  "readme.md": "# My Project\\nA sample project."
};

// Simulated fs operations
const fs = {
  readFileSync(path, encoding) {
    if (!virtualFS[path]) throw new Error("ENOENT: " + path);
    return virtualFS[path];
  },
  writeFileSync(path, data) {
    virtualFS[path] = data;
    console.log("Written:", path);
  },
  existsSync(path) {
    return path in virtualFS;
  }
};

// Read a file
const content = fs.readFileSync("hello.txt", "utf-8");
console.log("Content:", content);

// Check existence
console.log("Exists data.json:", fs.existsSync("data.json"));
console.log("Exists missing.txt:", fs.existsSync("missing.txt"));

// Write a file
fs.writeFileSync("output.txt", "New content here");
console.log("Read back:", fs.readFileSync("output.txt", "utf-8"));`,
        exercise: {
          instructions: 'Using the virtual FS, read "data.json", parse it as JSON, then write a new file "processed.json" with the parsed data plus a new field "processed: true". Finally read it back and print it.',
          starterCode: `const virtualFS = {
  "data.json": '{"name": "Node.js", "version": 20}'
};

const fs = {
  readFileSync(path) {
    if (!virtualFS[path]) throw new Error("ENOENT: " + path);
    return virtualFS[path];
  },
  writeFileSync(path, data) {
    virtualFS[path] = data;
  }
};

// Read data.json, parse it, add processed field, write processed.json, read it back
`,
          expectedOutput: '{"name":"Node.js","version":20,"processed":true}',
          solution: `const virtualFS = {
  "data.json": '{"name": "Node.js", "version": 20}'
};

const fs = {
  readFileSync(path) {
    if (!virtualFS[path]) throw new Error("ENOENT: " + path);
    return virtualFS[path];
  },
  writeFileSync(path, data) {
    virtualFS[path] = data;
  }
};

const raw = fs.readFileSync("data.json");
const data = JSON.parse(raw);
data.processed = true;
fs.writeFileSync("processed.json", JSON.stringify(data));
const result = fs.readFileSync("processed.json");
console.log(result);`,
          hint: 'Use JSON.parse() to parse, add the field, then JSON.stringify() to write back.'
        }
      },
      {
        id: 'path-module',
        title: 'Path Module',
        theory: `## The path Module

The \`path\` module provides utilities for working with file and directory paths.

### Key Methods
- \`path.join()\` - join path segments
- \`path.resolve()\` - resolve to absolute path
- \`path.basename()\` - get file name from path
- \`path.dirname()\` - get directory from path
- \`path.extname()\` - get file extension
- \`path.parse()\` - break path into components
- \`path.format()\` - build path from components

### Cross-Platform
\`path\` handles OS-specific separators (\\ vs /) automatically.

### Important
- \`path.join('a', 'b')\` → \`a/b\`
- \`path.basename('/foo/bar.txt')\` → \`bar.txt\`
- \`path.extname('file.html')\` → \`.html\``,
        exampleCode: `// Simulated path module
const path = {
  join(...parts) {
    return parts.join("/").replace(/\\/+/g, "/");
  },
  basename(fullPath) {
    const parts = fullPath.split("/");
    return parts[parts.length - 1];
  },
  dirname(fullPath) {
    const parts = fullPath.split("/");
    return parts.slice(0, -1).join("/") || "/";
  },
  extname(filePath) {
    const base = this.basename(filePath);
    const dotIndex = base.lastIndexOf(".");
    return dotIndex > 0 ? base.slice(dotIndex) : "";
  },
  parse(filePath) {
    const dir = this.dirname(filePath);
    const base = this.basename(filePath);
    const ext = this.extname(filePath);
    const name = base.slice(0, base.length - ext.length);
    return { dir, base, ext, name };
  }
};

const filePath = "/home/user/projects/app/index.js";

console.log("basename:", path.basename(filePath));
console.log("dirname:", path.dirname(filePath));
console.log("extname:", path.extname(filePath));

const parsed = path.parse(filePath);
console.log("parsed name:", parsed.name);
console.log("parsed dir:", parsed.dir);`,
        exercise: {
          instructions: 'Given the path "/var/www/html/styles/main.css", use the path module to extract: the basename, the extension, and the directory name. Print each on a separate line.',
          starterCode: `const path = {
  basename(fullPath) {
    const parts = fullPath.split("/");
    return parts[parts.length - 1];
  },
  dirname(fullPath) {
    const parts = fullPath.split("/");
    return parts.slice(0, -1).join("/") || "/";
  },
  extname(filePath) {
    const base = this.basename(filePath);
    const dotIndex = base.lastIndexOf(".");
    return dotIndex > 0 ? base.slice(dotIndex) : "";
  }
};

const filePath = "/var/www/html/styles/main.css";

// Print basename, extname, dirname
`,
          expectedOutput: 'main.css\n.css\n/var/www/html/styles',
          solution: `const path = {
  basename(fullPath) {
    const parts = fullPath.split("/");
    return parts[parts.length - 1];
  },
  dirname(fullPath) {
    const parts = fullPath.split("/");
    return parts.slice(0, -1).join("/") || "/";
  },
  extname(filePath) {
    const base = this.basename(filePath);
    const dotIndex = base.lastIndexOf(".");
    return dotIndex > 0 ? base.slice(dotIndex) : "";
  }
};

const filePath = "/var/www/html/styles/main.css";

console.log(path.basename(filePath));
console.log(path.extname(filePath));
console.log(path.dirname(filePath));`,
          hint: 'Use path.basename(), path.extname(), and path.dirname() in that order.'
        }
      },
      {
        id: 'directories',
        title: 'Working with Directories',
        theory: `## Directory Operations

Node.js provides methods for creating, reading, and managing directories.

### Key Methods
- \`mkdir\` / \`mkdirSync\` - create directory
- \`readdir\` / \`readdirSync\` - list directory contents
- \`rmdir\` / \`rmdirSync\` - remove empty directory
- \`{ recursive: true }\` - create nested dirs or remove recursively

### Walking Directories
\`\`\`js
const files = fs.readdirSync('./src');
files.forEach(file => {
  const fullPath = path.join('./src', file);
  const stat = fs.statSync(fullPath);
  if (stat.isFile()) console.log("File:", file);
  if (stat.isDirectory()) console.log("Dir:", file);
});
\`\`\`

### Common Patterns
- Create directory if not exists
- Filter files by extension
- Recursive directory traversal`,
        exampleCode: `// Simulated directory operations
const virtualFS = {
  "/project/src/index.js": "console.log('app');",
  "/project/src/utils.js": "module.exports = {};",
  "/project/src/components/App.js": "export default App;",
  "/project/package.json": '{"name": "project"}',
  "/project/README.md": "# Project"
};

// Get all files in a "directory"
function readdir(dirPath) {
  return Object.keys(virtualFS)
    .filter(f => f.startsWith(dirPath + "/"))
    .map(f => {
      const relative = f.slice(dirPath.length + 1);
      return relative.split("/")[0];
    })
    .filter((v, i, a) => a.indexOf(v) === i);
}

function isFile(path) {
  return path in virtualFS;
}

// List project root
const entries = readdir("/project");
console.log("Root entries:", entries.join(", "));

// List src directory
const srcEntries = readdir("/project/src");
console.log("Src entries:", srcEntries.join(", "));

// Filter by extension
const jsFiles = Object.keys(virtualFS).filter(f => f.endsWith(".js"));
console.log("JS files:", jsFiles.length);`,
        exercise: {
          instructions: 'Using the virtual FS, find all files that end with ".js" and print their basenames (just the filename, not the full path). Then count how many JSON files exist.',
          starterCode: `const virtualFS = {
  "/project/src/index.js": "console.log('app');",
  "/project/src/utils.js": "module.exports = {};",
  "/project/src/components/App.js": "export default App;",
  "/project/package.json": '{"name": "project"}',
  "/project/README.md": "# Project",
  "/project/config/settings.json": '{"debug": true}'
};

// Find all .js files and print their basenames

// Count JSON files
`,
          expectedOutput: 'index.js\nutils.js\nApp.js\nJSON files: 2',
          solution: `const virtualFS = {
  "/project/src/index.js": "console.log('app');",
  "/project/src/utils.js": "module.exports = {};",
  "/project/src/components/App.js": "export default App;",
  "/project/package.json": '{"name": "project"}',
  "/project/README.md": "# Project",
  "/project/config/settings.json": '{"debug": true}'
};

const jsFiles = Object.keys(virtualFS).filter(f => f.endsWith(".js"));
jsFiles.forEach(f => {
  const parts = f.split("/");
  console.log(parts[parts.length - 1]);
});

const jsonFiles = Object.keys(virtualFS).filter(f => f.endsWith(".json"));
console.log("JSON files:", jsonFiles.length);`,
          hint: 'Use .filter() with .endsWith(".js"), then split by "/" and take the last element for the basename.'
        }
      },
      {
        id: 'streams',
        title: 'Streams',
        theory: `## Streams

Streams process data piece by piece, without loading everything into memory.

### Types of Streams
- **Readable**: source of data (fs.createReadStream)
- **Writable**: destination for data (fs.createWriteStream)
- **Transform**: modify data as it passes through
- **Duplex**: both readable and writable

### Piping
\`\`\`js
readableStream.pipe(transformStream).pipe(writableStream);
\`\`\`

### Why Streams?
- Memory efficient for large files
- Process data as it arrives
- Backpressure handling built-in

### Events
- \`data\` - chunk of data available
- \`end\` - no more data
- \`error\` - something went wrong`,
        exampleCode: `// Simulated stream
class ReadableStream {
  constructor(data) {
    this.data = data;
    this.chunkSize = 5;
    this.pos = 0;
    this.listeners = {};
  }
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
    return this;
  }
  read() {
    while (this.pos < this.data.length) {
      const chunk = this.data.slice(this.pos, this.pos + this.chunkSize);
      this.pos += this.chunkSize;
      (this.listeners["data"] || []).forEach(fn => fn(chunk));
    }
    (this.listeners["end"] || []).forEach(fn => fn());
  }
}

// Create a readable stream from a string
const stream = new ReadableStream("Hello, this is stream data!");

const chunks = [];
stream.on("data", (chunk) => {
  console.log("Chunk:", chunk);
  chunks.push(chunk);
});

stream.on("end", () => {
  console.log("Total chunks:", chunks.length);
  console.log("Reassembled:", chunks.join(""));
});

stream.read();`,
        exercise: {
          instructions: 'Create a ReadableStream with data "Node.js streams are powerful!". Set the chunkSize to 7. Collect all chunks in an array, then on "end" print the number of chunks and the full reassembled string.',
          starterCode: `class ReadableStream {
  constructor(data, chunkSize = 5) {
    this.data = data;
    this.chunkSize = chunkSize;
    this.pos = 0;
    this.listeners = {};
  }
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
    return this;
  }
  read() {
    while (this.pos < this.data.length) {
      const chunk = this.data.slice(this.pos, this.pos + this.chunkSize);
      this.pos += this.chunkSize;
      (this.listeners["data"] || []).forEach(fn => fn(chunk));
    }
    (this.listeners["end"] || []).forEach(fn => fn());
  }
}

// Create stream with chunkSize 7

// Collect chunks and print results
`,
          expectedOutput: 'Chunks: 5\nFull: Node.js streams are powerful!',
          solution: `class ReadableStream {
  constructor(data, chunkSize = 5) {
    this.data = data;
    this.chunkSize = chunkSize;
    this.pos = 0;
    this.listeners = {};
  }
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
    return this;
  }
  read() {
    while (this.pos < this.data.length) {
      const chunk = this.data.slice(this.pos, this.pos + this.chunkSize);
      this.pos += this.chunkSize;
      (this.listeners["data"] || []).forEach(fn => fn(chunk));
    }
    (this.listeners["end"] || []).forEach(fn => fn());
  }
}

const stream = new ReadableStream("Node.js streams are powerful!", 7);

const chunks = [];
stream.on("data", (chunk) => chunks.push(chunk));
stream.on("end", () => {
  console.log("Chunks:", chunks.length);
  console.log("Full:", chunks.join(""));
});

stream.read();`,
          hint: 'Pass chunkSize as second argument. Collect in array on "data", print count and joined string on "end".'
        }
      },
      {
        id: 'json-files',
        title: 'Working with JSON Files',
        theory: `## JSON Files in Node.js

JSON is the standard data format in Node.js. Common for config files, APIs, and data storage.

### Reading JSON
\`\`\`js
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
\`\`\`

Or use require for static files:
\`\`\`js
const config = require('./config.json');
\`\`\`

### Writing JSON
\`\`\`js
fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
\`\`\`

### JSON.stringify Options
- Second arg: replacer function or array of keys
- Third arg: indentation (2 for pretty print)

### Common Patterns
- Config files (\`package.json\`, \`.eslintrc.json\`)
- API responses
- Data export/import
- Database dumps`,
        exampleCode: `// Simulated JSON file operations
const virtualFS = {};

const fs = {
  writeFileSync(path, data) { virtualFS[path] = data; },
  readFileSync(path) { return virtualFS[path]; }
};

// Create a JSON config
const config = {
  app: { name: "MyApp", port: 3000 },
  database: { host: "localhost", port: 5432 },
  features: ["auth", "logging", "cache"]
};

// Write pretty JSON
fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
console.log("Written config.json");

// Read it back
const raw = fs.readFileSync("config.json");
const parsed = JSON.parse(raw);
console.log("App name:", parsed.app.name);
console.log("Features:", parsed.features.join(", "));

// Modify and save
parsed.app.version = "1.0.0";
fs.writeFileSync("config.json", JSON.stringify(parsed, null, 2));
const updated = JSON.parse(fs.readFileSync("config.json"));
console.log("Updated version:", updated.app.version);`,
        exercise: {
          instructions: 'Create an array of 3 user objects (each with name and age). Write it as pretty JSON to "users.json". Read it back, filter users with age >= 25, and print the count of filtered users.',
          starterCode: `const virtualFS = {};
const fs = {
  writeFileSync(path, data) { virtualFS[path] = data; },
  readFileSync(path) { return virtualFS[path]; }
};

// Create users array

// Write as pretty JSON

// Read back, filter age >= 25, print count
`,
          expectedOutput: 'Users 25+: 2',
          solution: `const virtualFS = {};
const fs = {
  writeFileSync(path, data) { virtualFS[path] = data; },
  readFileSync(path) { return virtualFS[path]; }
};

const users = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 22 },
  { name: "Charlie", age: 28 }
];

fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

const raw = fs.readFileSync("users.json");
const parsed = JSON.parse(raw);
const filtered = parsed.filter(u => u.age >= 25);
console.log("Users 25+:", filtered.length);`,
          hint: 'Create 3 users with varying ages. Use JSON.stringify with null, 2 for pretty print. Filter with .filter(u => u.age >= 25).'
        }
      }
    ]
  }
];

// Combine all courses
export const allCourses: Course[] = [...courses, ...advancedCourses, ...moreCourses];

export function getAllCourses(): Course[] {
  return allCourses;
}

export function getCourse(courseId: string): Course | undefined {
  return courses.find(c => c.id === courseId);
}

export function getCourseById(courseId: string): Course | undefined {
  return allCourses.find(c => c.id === courseId);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  return course?.lessons.find(l => l.id === lessonId);
}

export function getNextLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  const index = course.lessons.findIndex(l => l.id === lessonId);
  return course.lessons[index + 1];
}

export function getPrevLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  const index = course.lessons.findIndex(l => l.id === lessonId);
  return course.lessons[index - 1];
}



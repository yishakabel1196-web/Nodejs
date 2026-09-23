import { Challenge } from './types';

export const challenges: Challenge[] = [
  // Day 1: Create User
  {
    day: 1,
    type: 'A',
    title: 'Create User',
    spec: 'Create POST /users that creates a new user with name and email. Return the created user with an auto-generated ID.',
    testCases: [
      {
        request: {
          method: 'POST',
          path: '/users',
          body: { name: 'Alice', email: 'alice@test.com' }
        },
        expectedStatus: 201,
        expectedBody: { id: 1, name: 'Alice', email: 'alice@test.com' },
        description: 'Create first user'
      },
      {
        request: {
          method: 'POST',
          path: '/users',
          body: { name: 'Bob', email: 'bob@test.com' }
        },
        expectedStatus: 201,
        expectedBody: { id: 2, name: 'Bob', email: 'bob@test.com' },
        description: 'Create second user with auto-incremented ID'
      }
    ],
    solution: `const express = require('express');
const app = express();
app.use(express.json());

let users = [];
let nextId = 1;

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const user = { id: nextId++, name, email };
  users.push(user);
  
  res.status(201).json(user);
});

module.exports = app;`,
    explanation: 'This route creates a new user with an auto-incremented ID. It validates that name and email are provided, then adds the user to the array and returns it with a 201 status.',
    hints: [
      'Use POST method for creating resources',
      'Return 201 status code for successful creation',
      'Auto-increment IDs starting from 1'
    ]
  },

  // Day 2: Get User by ID
  {
    day: 2,
    type: 'A',
    title: 'Get User by ID',
    spec: 'Create GET /users/:id that returns a user by their ID. Return 404 if the user doesn\'t exist.',
    testCases: [
      {
        request: {
          method: 'GET',
          path: '/users/1',
          params: { id: '1' }
        },
        expectedStatus: 200,
        expectedBody: { id: 1, name: 'Alice', email: 'alice@test.com' },
        description: 'Get existing user'
      },
      {
        request: {
          method: 'GET',
          path: '/users/999',
          params: { id: '999' }
        },
        expectedStatus: 404,
        expectedBody: { error: 'User not found' },
        description: 'Get non-existent user returns 404'
      }
    ],
    solution: `const express = require('express');
const app = express();

const users = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' }
];

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.status(200).json(user);
});

module.exports = app;`,
    explanation: 'This route extracts the ID from the URL params, finds the user in the array, and returns 404 if not found. The parseInt() converts the string ID to a number.',
    hints: [
      'Use req.params.id to get the ID from the URL',
      'Convert string ID to number with parseInt()',
      'Use Array.find() to locate the user'
    ]
  },

  // Day 3: Get All Users
  {
    day: 3,
    type: 'A',
    title: 'Get All Users',
    spec: 'Create GET /users that returns all users as an array.',
    testCases: [
      {
        request: {
          method: 'GET',
          path: '/users'
        },
        expectedStatus: 200,
        expectedBody: [
          { id: 1, name: 'Alice', email: 'alice@test.com' },
          { id: 2, name: 'Bob', email: 'bob@test.com' }
        ],
        description: 'Get all users'
      }
    ],
    solution: `const express = require('express');
const app = express();

const users = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' }
];

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

module.exports = app;`,
    explanation: 'Simple route that returns the entire users array. Returns 200 with the array of all users.',
    hints: [
      'Use GET method for reading resources',
      'Return the array directly with res.json()'
    ]
  },

  // Day 4: Update User
  {
    day: 4,
    type: 'A',
    title: 'Update User',
    spec: 'Create PUT /users/:id that updates a user\'s name and/or email. Return the updated user or 404 if not found.',
    testCases: [
      {
        request: {
          method: 'PUT',
          path: '/users/1',
          params: { id: '1' },
          body: { name: 'Alice Updated' }
        },
        expectedStatus: 200,
        expectedBody: { id: 1, name: 'Alice Updated', email: 'alice@test.com' },
        description: 'Update user name'
      },
      {
        request: {
          method: 'PUT',
          path: '/users/999',
          params: { id: '999' },
          body: { name: 'Nobody' }
        },
        expectedStatus: 404,
        expectedBody: { error: 'User not found' },
        description: 'Update non-existent user returns 404'
      }
    ],
    solution: `const express = require('express');
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' }
];

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.status(200).json(users[userIndex]);
});

module.exports = app;`,
    explanation: 'This route finds the user by ID, updates only the provided fields using spread operator, and returns the updated user. Returns 404 if user doesn\'t exist.',
    hints: [
      'Use findIndex() to locate the user in the array',
      'Use spread operator to merge updates: { ...oldUser, ...updates }',
      'Return 404 if user not found'
    ]
  },

  // Day 5: Delete User
  {
    day: 5,
    type: 'A',
    title: 'Delete User',
    spec: 'Create DELETE /users/:id that deletes a user. Return 204 on success or 404 if not found.',
    testCases: [
      {
        request: {
          method: 'DELETE',
          path: '/users/1',
          params: { id: '1' }
        },
        expectedStatus: 204,
        expectedBody: null,
        description: 'Delete existing user'
      },
      {
        request: {
          method: 'DELETE',
          path: '/users/999',
          params: { id: '999' }
        },
        expectedStatus: 404,
        expectedBody: { error: 'User not found' },
        description: 'Delete non-existent user returns 404'
      }
    ],
    solution: `const express = require('express');
const app = express();

let users = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' }
];

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = app;`,
    explanation: 'This route finds the user by ID, removes them from the array using splice(), and returns 204 (No Content) on success. Returns 404 if user doesn\'t exist.',
    hints: [
      'Use DELETE method for removing resources',
      'Use splice() to remove from array',
      'Return 204 status with no body on success'
    ]
  },

  // Day 6: Create Post
  {
    day: 6,
    type: 'A',
    title: 'Create Post',
    spec: 'Create POST /posts that creates a new post with title, content, and authorId. Return the created post with an auto-generated ID.',
    testCases: [
      {
        request: {
          method: 'POST',
          path: '/posts',
          body: { title: 'First Post', content: 'Hello World', authorId: 1 }
        },
        expectedStatus: 201,
        expectedBody: { id: 1, title: 'First Post', content: 'Hello World', authorId: 1 },
        description: 'Create first post'
      }
    ],
    solution: `const express = require('express');
const app = express();
app.use(express.json());

let posts = [];
let nextId = 1;

app.post('/posts', (req, res) => {
  const { title, content, authorId } = req.body;
  
  if (!title || !content || !authorId) {
    return res.status(400).json({ error: 'Title, content, and authorId are required' });
  }
  
  const post = { id: nextId++, title, content, authorId };
  posts.push(post);
  
  res.status(201).json(post);
});

module.exports = app;`,
    explanation: 'Similar to creating users, this creates a post with title, content, and authorId. Validates all required fields and auto-increments the ID.',
    hints: [
      'Posts have title, content, and authorId fields',
      'Validate all three fields are present',
      'Auto-increment ID starting from 1'
    ]
  },

  // Day 7: Get Posts by Author
  {
    day: 7,
    type: 'A',
    title: 'Get Posts by Author',
    spec: 'Create GET /users/:userId/posts that returns all posts by a specific user.',
    testCases: [
      {
        request: {
          method: 'GET',
          path: '/users/1/posts',
          params: { userId: '1' }
        },
        expectedStatus: 200,
        expectedBody: [
          { id: 1, title: 'First Post', content: 'Hello World', authorId: 1 }
        ],
        description: 'Get posts by user 1'
      },
      {
        request: {
          method: 'GET',
          path: '/users/999/posts',
          params: { userId: '999' }
        },
        expectedStatus: 200,
        expectedBody: [],
        description: 'Get posts by non-existent user returns empty array'
      }
    ],
    solution: `const express = require('express');
const app = express();

const posts = [
  { id: 1, title: 'First Post', content: 'Hello World', authorId: 1 },
  { id: 2, title: 'Second Post', content: 'Another post', authorId: 2 }
];

app.get('/users/:userId/posts', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userPosts = posts.filter(p => p.authorId === userId);
  
  res.status(200).json(userPosts);
});

module.exports = app;`,
    explanation: 'This route filters posts by authorId and returns them as an array. Returns empty array if user has no posts (not 404).',
    hints: [
      'Use Array.filter() to find posts by authorId',
      'Return empty array if no posts found (not 404)',
      'Convert userId to number with parseInt()'
    ]
  },

  // Day 8: Create Comment
  {
    day: 8,
    type: 'A',
    title: 'Create Comment',
    spec: 'Create POST /posts/:postId/comments that creates a comment on a post with content and authorId.',
    testCases: [
      {
        request: {
          method: 'POST',
          path: '/posts/1/comments',
          params: { postId: '1' },
          body: { content: 'Great post!', authorId: 2 }
        },
        expectedStatus: 201,
        expectedBody: { id: 1, postId: 1, content: 'Great post!', authorId: 2 },
        description: 'Create comment on post 1'
      }
    ],
    solution: `const express = require('express');
const app = express();
app.use(express.json());

let comments = [];
let nextId = 1;

app.post('/posts/:postId/comments', (req, res) => {
  const postId = parseInt(req.params.postId);
  const { content, authorId } = req.body;
  
  if (!content || !authorId) {
    return res.status(400).json({ error: 'Content and authorId are required' });
  }
  
  const comment = { id: nextId++, postId, content, authorId };
  comments.push(comment);
  
  res.status(201).json(comment);
});

module.exports = app;`,
    explanation: 'Creates a comment linked to a specific post. The postId comes from the URL params, content and authorId from the request body.',
    hints: [
      'Get postId from req.params.postId',
      'Get content and authorId from req.body',
      'Include postId in the returned comment object'
    ]
  },

  // Day 9: Get Comments for Post
  {
    day: 9,
    type: 'A',
    title: 'Get Comments for Post',
    spec: 'Create GET /posts/:postId/comments that returns all comments for a specific post.',
    testCases: [
      {
        request: {
          method: 'GET',
          path: '/posts/1/comments',
          params: { postId: '1' }
        },
        expectedStatus: 200,
        expectedBody: [
          { id: 1, postId: 1, content: 'Great post!', authorId: 2 }
        ],
        description: 'Get comments for post 1'
      }
    ],
    solution: `const express = require('express');
const app = express();

const comments = [
  { id: 1, postId: 1, content: 'Great post!', authorId: 2 },
  { id: 2, postId: 1, content: 'Thanks!', authorId: 1 }
];

app.get('/posts/:postId/comments', (req, res) => {
  const postId = parseInt(req.params.postId);
  const postComments = comments.filter(c => c.postId === postId);
  
  res.status(200).json(postComments);
});

module.exports = app;`,
    explanation: 'Filters comments by postId and returns them. Returns empty array if no comments exist for that post.',
    hints: [
      'Use Array.filter() to find comments by postId',
      'Return empty array if no comments found',
      'Convert postId to number with parseInt()'
    ]
  },

  // Day 10: Like Post
  {
    day: 10,
    type: 'A',
    title: 'Like Post',
    spec: 'Create POST /posts/:postId/likes that adds a like to a post from a user (userId in body). Return the updated like count.',
    testCases: [
      {
        request: {
          method: 'POST',
          path: '/posts/1/likes',
          params: { postId: '1' },
          body: { userId: 2 }
        },
        expectedStatus: 200,
        expectedBody: { postId: 1, likes: 1 },
        description: 'Like post 1'
      }
    ],
    solution: `const express = require('express');
const app = express();
app.use(express.json());

const postLikes = {};

app.post('/posts/:postId/likes', (req, res) => {
  const postId = parseInt(req.params.postId);
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  if (!postLikes[postId]) {
    postLikes[postId] = 0;
  }
  
  postLikes[postId]++;
  
  res.status(200).json({ postId, likes: postLikes[postId] });
});

module.exports = app;`,
    explanation: 'Tracks likes per post in an object. Increments the like count and returns the updated count. Initializes to 0 if first like.',
    hints: [
      'Use an object to track likes: { postId: count }',
      'Initialize to 0 if post has no likes yet',
      'Increment and return the new count'
    ]
  }
];

export function getChallenge(day: number): Challenge | undefined {
  return challenges.find(c => c.day === day);
}

export function getNextChallenge(currentDay: number): Challenge | undefined {
  return challenges.find(c => c.day === currentDay + 1);
}

export function getPreviousChallenge(currentDay: number): Challenge | undefined {
  return challenges.find(c => c.day === currentDay - 1);
}

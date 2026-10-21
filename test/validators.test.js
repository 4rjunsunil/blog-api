const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validateRegistration,
  validateLogin,
  validatePost,
  validateCategory,
} = require('../src/utils/validators');

const validId = '507f1f77bcf86cd799439011';

test('registration validation accepts valid details and rejects weak passwords', () => {
  assert.deepEqual(validateRegistration({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'correct-horse',
  }), []);
  assert.ok(validateRegistration({
    name: 'Ada',
    email: 'ada@example.com',
    password: 'short',
  }).some((error) => error.startsWith('password')));
});

test('login validation requires a valid email and password', () => {
  assert.deepEqual(validateLogin({ email: 'ada@example.com', password: 'secret' }), []);
  assert.equal(validateLogin({ email: 'bad', password: '' }).length, 2);
});

test('post validation requires content and at least one category but not a client-supplied author', () => {
  const post = {
    title: 'A title',
    content: 'Post body',
    categories: [validId],
  };
  assert.deepEqual(validatePost(post), []);
  assert.ok(validatePost({ ...post, categories: [] }).some((error) => error.startsWith('categories')));
  assert.ok(validatePost({ ...post, author: validId }).some((error) => error.startsWith('author')));
});

test('category validation accepts its documented fields', () => {
  assert.deepEqual(validateCategory({ name: 'Engineering', description: 'Career advice' }), []);
  assert.ok(validateCategory({ name: ' ' }).length > 0);
});

test('validators reject non-object request bodies', () => {
  assert.deepEqual(validateRegistration([]), ['Request body must be a JSON object']);
  assert.deepEqual(validatePost(null), ['Request body must be a JSON object']);
});

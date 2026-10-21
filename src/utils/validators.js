const objectIdPattern = /^[a-f\d]{24}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateRegistration(body) {
  const errors = [];
  if (!isObject(body)) {
    return ['Request body must be a JSON object'];
  }

  if (typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > 80) {
    errors.push('name is required and must be at most 80 characters');
  }
  if (typeof body.email !== 'string' || !emailPattern.test(body.email.trim())) {
    errors.push('email must be a valid email address');
  }
  if (
    typeof body.password !== 'string'
    || body.password.length < 8
    || Buffer.byteLength(body.password, 'utf8') > 72
  ) {
    errors.push('password must be at least 8 characters and at most 72 bytes');
  }
  return errors;
}

function validateLogin(body) {
  if (!isObject(body)) {
    return ['Request body must be a JSON object'];
  }
  const errors = [];
  if (typeof body.email !== 'string' || !emailPattern.test(body.email.trim())) {
    errors.push('email must be a valid email address');
  }
  if (typeof body.password !== 'string' || !body.password) {
    errors.push('password is required');
  }
  return errors;
}

function validatePost(body) {
  const errors = [];
  if (!isObject(body)) {
    return ['Request body must be a JSON object'];
  }

  if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 160) {
    errors.push('title is required and must be at most 160 characters');
  }
  if (typeof body.content !== 'string' || !body.content.trim()) {
    errors.push('content is required');
  }
  if (Object.prototype.hasOwnProperty.call(body, 'author')) {
    errors.push('author is assigned from the authenticated user and must not be provided');
  }
  if (!Array.isArray(body.categories) || body.categories.length === 0) {
    errors.push('categories must contain at least one category ID');
  } else if (body.categories.some((id) => typeof id !== 'string' || !objectIdPattern.test(id))) {
    errors.push('each category must be a valid category ID');
  }
  return errors;
}

function validateCategory(body) {
  if (!isObject(body)) {
    return ['Request body must be a JSON object'];
  }
  const errors = [];
  if (typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > 80) {
    errors.push('name is required and must be at most 80 characters');
  }
  if (
    body.description !== undefined
    && (typeof body.description !== 'string' || body.description.length > 300)
  ) {
    errors.push('description must be a string of at most 300 characters');
  }
  return errors;
}

module.exports = {
  validateRegistration,
  validateLogin,
  validatePost,
  validateCategory,
};

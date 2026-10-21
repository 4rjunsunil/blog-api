const express = require('express');
const postController = require('../controllers/postController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { validatePost } = require('../utils/validators');

const router = express.Router();

router.get('/', postController.listPosts);
router.get('/:id', postController.getPost);
router.post('/', authenticate, validate(validatePost), postController.createPost);
router.put('/:id', authenticate, validate(validatePost), postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;

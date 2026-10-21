const express = require('express');
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { validateCategory } = require('../utils/validators');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.post('/', authenticate, validate(validateCategory), categoryController.createCategory);

module.exports = router;

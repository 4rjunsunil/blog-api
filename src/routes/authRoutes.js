const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { validateRegistration, validateLogin } = require('../utils/validators');

const router = express.Router();

router.post('/register', validate(validateRegistration), authController.register);
router.post('/login', validate(validateLogin), authController.login);

module.exports = router;

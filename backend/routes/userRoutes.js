
const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/userControllers/signup');
const { login } = require('../controllers/userControllers/login');

// TO sign up user
router.post('/user/signup', signup);

// to login user
router.post('/user/login', login);

module.exports = router;


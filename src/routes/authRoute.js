const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

//ruta post, sign UP

router.post('/signup', authController.signUp);

//ruta post, sign IN

router.post('/signin', authController.signIn);

module.exports = router;

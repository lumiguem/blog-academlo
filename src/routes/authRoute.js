const express = require('express');

// controllers
const authController = require('../controllers/authController');

// middlewares
const validationMiddleware = require('./../middlewares/validationMiddleware')
const userMiddleware = require('../middlewares/userMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();

//ruta post, signUP

router.post(
    '/signup',
    validationMiddleware.createUserValidation,
    authController.signUp);

//ruta post, signIN

router.post(
    '/signin',
    validationMiddleware.loginUserValidation,
    authController.signIn);

router.use(authMiddleware.protect);

router.patch(
    '/password/:id',
    validationMiddleware.updatePasswordValidation,
    userMiddleware.validUser,
    authController.updatePassword
);

module.exports = router;

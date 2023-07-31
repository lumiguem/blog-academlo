const express = require('express');

const userController = require('./../controllers/userController');

const userMiddleware = require('../middlewares/userMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', userController.findAllUsers);

// router.use('/:id', userMiddleware.validUser);

router
  .use('/:id', userMiddleware.validUser)
  .route('/:id')
  .get(userController.findOneUser)
  .patch(validationMiddleware.updateUserValidation, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

const express = require('express');

const userController = require('./../controllers/userController');

const userMiddleware = require('../middlewares/userMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router();

router.use(authMiddleware.protect)

router.get('/', userController.findAllUsers);

// router.use('/:id', userMiddleware.validUser);

router.use(authMiddleware.restrictTo('admin', 'user'));

router
  .use('/:id', userMiddleware.validUser)
  .route('/:id')
  .get(userController.findOneUser)
  .patch(validationMiddleware.updateUserValidation, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

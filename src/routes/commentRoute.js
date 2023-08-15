const express = require('express');

//controllers
const commentController = require('../controllers/commentController');

// middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const commentMiddleware = require('../middlewares/commentMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware')

const router = express.Router();

router.use(authMiddleware.protect);

router
    .route('/')
    .get(commentController.findAllComments)
    .post(validationMiddleware.createCommentValidation, commentController.createComment)

router
    .use('/:id', commentMiddleware.validComment)
    .route('/:id')
    .get(commentController.findOneComment)
    .patch(validationMiddleware.updateCommentValidation, commentController.updateComment)
    .delete(commentController.deleteComment)


module.exports = router
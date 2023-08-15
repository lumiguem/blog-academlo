const express = require('express');

//controllers
const postController = require('../controllers/postController');

// middlewares
const authMidleware = require('../middlewares/authMiddleware');
const validationMidleware = require('../middlewares/validationMiddleware');
const postMiddleware = require('../middlewares/postMiddleware');
const userMiddleware = require('../middlewares/userMiddleware')


const router = express.Router();

router
    .route('/')
    .get(postController.findAllPosts)
    .post(
        authMidleware.protect,
        validationMidleware.createPostValidation,
        postController.createPost);

router.use(authMidleware.protect);

router.get('/me', postController.findMyPosts);
router.get('/profile/:id', userMiddleware.validUser, postController.findUserPosts)

router
    .use('/:id', postMiddleware.validPost)
    .route('/:id')
    .get(postController.findOnePost)
    .patch(authMidleware.protectAccountOwner, validationMidleware.createPostValidation, postController.updatePost)
    .delete(authMidleware.protectAccountOwner, postController.deletePost);

module.exports = router
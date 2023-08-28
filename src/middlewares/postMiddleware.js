const catchAsync = require('../utils/catchAsync');
const { Post, postStatus } = require('../models/postModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.validPost = catchAsync(async (req, res, next) => {
    // 1. traer info de la req.params
    const { id } = req.params;
    // 2.  busco el post 
    const post = await Post.findOne({
        where: {
            status: postStatus.active,
            id,
        },
        include: {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl', 'description']
        }
    });
    // 3. validar que el post exista
    if (!post) {
        return next(new AppError(`Post with id: ${id} not found`));
    }
    // 4. adjunto el posto por la req. y doy continuidad 
    req.user = post.user;
    req.post = post;
    next();
});
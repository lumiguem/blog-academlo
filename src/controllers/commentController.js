const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');

exports.findAllComments = catchAsync(async (req, res, next) => {
    const comments = Comment.findAll({
        where: {
            status: 'active'
        }
    })
    return res.status(200).json({
        status: 'success',
        results: comments.length,
        comments,
    });
});

exports.createComment = catchAsync(async (req, res, next) => {
    const { text, postId } = req.body;
    const { id: userId } = req.sessionUser;

    const comment = await Comment.create({ text, postId, userId });

    return res.status(201).json({
        status: 'success',
        message: 'Comment created successfully',
        comment,
    })
});

exports.findOneComment = catchAsync(async (req, res, next) => {
    const { comment } = req;

    return res.status(200).json({
        status: 'success',
        comment
    })
});

exports.updateComment = catchAsync(async (req, res, next) => {
    const { comment } = req;
    const { text } = req.body;

    await comment.update({ text })
    return res.status(200).json({
        status: 'success',
        message: 'The comment has been updated',
    })
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    const { comment } = req;
    await comment.update({ status: 'disabled' })

    return res.status(200).json({
        status: 'success',
        message: 'The comment has been deleted'
    })
});
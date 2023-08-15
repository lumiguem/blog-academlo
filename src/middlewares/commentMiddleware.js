const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/commentModel');
const AppError = require('../utils/appError');

exports.validComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findOne({
        where: {
            status: 'active',
            id,
        }
    });

    if (!comment) {
        return next(AppError(`Comment not found`, 404))
    };

    req.comment = comment
    next();
});
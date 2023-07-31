const User = require('../models/userModel');
const AppError = require('../utils/apperror');
const catchAsync = require('../utils/catchAsync');

exports.validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`User with Id: ${id} not found`, 404));
  }

  req.user = user;
  next();
});

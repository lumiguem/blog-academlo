const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validUser = catchAsync(async (req, res, next) => {
  // 1. traer el id de la req.params, este es el ide del usuario
  const { id } = req.params;

  // 2. busar el usuario con status active y el id recibido
  const user = await User.findOne({
    where: {
      id,
      status: 'active',
    },
  });
  // 3. valido que si no existe envío el error
  if (!user) {
    return next(new AppError(`User with Id: ${id} not found`, 404));
  }

  // 4. adjunto el usuario 
  req.user = user;
  next();

});

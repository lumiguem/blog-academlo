const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, description } = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    description,
  });

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'active',

    }
  })

  if (!user) {
    return next(new AppError(`User with email: ${email} not found`, 404))
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  const token = await generateJWT(user.id)

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    }
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. traerme el usuario que viene de la req del middleware 
  const { user } = req;
  // 2. traerme los datos de la req.body
  const { currentPassword, newPassword } = req.body;
  // 3. validar si la constraseña actual y nueva son iguales enviar un error
  if (currentPassword === newPassword) {
    return next(new AppError('The password cannot be the same'));
  }

  // 4. validar que la contraseña actual es igual a la contraseña en bd
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect Password', 401))
  }

  // 5. Encriptar la nueva contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt)

  // 6. actualizar el usuario que viene de la req
  await user.update({
    password: encryptedPassword,
    passwordChangeAt: new Date(),
  });

  // 7. Enviar el mensaje al cliente 
  return res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully '
  })
})

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');

exports.protect = catchAsync(async (req, res, next) => {
    // 1. extraer el token 
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Validar si el token existe
    if (!token) {
        return next(
            new AppError('You are not logged in!, Please log in to get access', 401)
        );
    }

    // 3. decodificar el token jwt
    const decoded = await promisify(jwt.verify)(
        token,
        process.env.SECRET_JWT_SEED
    );

    // 4. buscar el usuario y validar si existe
    const user = await User.findOne({
        where: {
            id: decoded.id,
            status: 'active',
        },
    });

    if (!user) {
        return next(
            new AppError('The owner of this token is no longer available', 401)
        );
    }

    // 5. validar el tiempo en el que se cambió la contraseña, para saber si el token 
    // generado fue generado despues del cambio de contraseña 
    if (user.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            user.passwordChangedAt.getTime() / 1000,
            10
        );

        if (decoded.iat < changedTimeStamp) {
            return next(
                new AppError('User recently changed password! please login again', 401)
            );
        }
    }

    // 6. Adjuntar usuario en sesion

    req.sessionUser = user;
    next();
});

exports.protectAccountOwner = (req, res, next) => {
    const { user, sessionUser } = req;

    console.log('user: ', user);
    console.log('sessionUser: ', sessionUser);

    if (user.id !== sessionUser.id) {
        return next(new AppError('You do not own this account', 401));
    }

    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.sessionUser.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    }
}
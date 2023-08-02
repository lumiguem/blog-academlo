const AppError = require("../utils/appError");

const handleCastError22001 = () =>
  new AppError('The number of characters is grater than expected', 400)


const sendErrorDev = (err, res) => {
  console.log(err);
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err,
  });
};

const sendErrorProd = (err, res) => {
  console.log(err);
  //operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programming or other unknown error: don't leak error detail
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};


const globalErrorHander = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.parent?.code === '22001') error = handleCastError22001();

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHander;
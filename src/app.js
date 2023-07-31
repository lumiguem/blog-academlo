const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/apperror');

// routes
const userRoutes = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auths', authRoutes);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;

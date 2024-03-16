const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { xss } = require('express-xss-sanitizer');

const DB = require('./dataBase');
dotenv.config({ path: './config.env' });
const globalErrorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/appError');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.enable('trust proxy');
process.on('uncaughtException', (err) => {
  //if print variable without declare it
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`MOD :${process.env.NODE_ENV} `);
}

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(xss());

app.use(compression());

app.use(helmet());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT;
const URL = process.env.DATA_BASE_URL;

DB(URL);
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT : ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  //if we cannot login with db
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

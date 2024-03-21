const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

require('./controllers/googleAuth');

const DB = require('./dataBase');
dotenv.config({ path: './config.env' });
const globalErrorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/appError');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRoutes');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.enable('trust proxy');
process.on('uncaughtException', (err) => {
  //if print variable without declare it
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`MOD :${process.env.NODE_ENV} `);
}

// SET security HTTP Request
app.use(helmet());

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

//session
app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: true,
    secret: 'Task-Tech App',
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Body parser , reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NOSQl query injection
app.use(mongSanitize());

// Data sanitization against xxs
app.use(xss());

app.use(compression());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.get('/auth/failure', (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'somthing went wrong',
  });
});

app.get('/', (req, res) => {
  res.send(
    '<a href="/api/v1/auth/google">Authenticate with Google </a> <br/> <a href="/api/v1/auth/facebook">Authenticate with Facebook </a>'
  );
});

//online and offline users
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('new connection', socket.id);
  //add new user
  socket.on('addNewUser', (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log('onlineUsers', onlineUsers);

    io.emit('getOnlineUsers', onlineUsers);
  });

  // add message
  socket.on('sendMessage', (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    console.log('sending from socket to: ', message.recipientId);
    console.log('Message', message);

    if (user) {
      io.to(user.socketId).emit('getMessage', message);
      io.to(user.socketId).emit('getNotification', {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on('typing', () => {
    socket.broadcast.emit('show-typing-status');
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('clear-typing-status');
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit('getOnlineUsers', onlineUsers);
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/messages', messageRouter);

//auth with google
app.get(
  '/api/v1/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.BASE_URL,
    failureRedirect: '/auth/failure',
  })
);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
const URL = process.env.DATA_BASE_URL;

DB(URL);
const server = http.listen(PORT, () => {
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

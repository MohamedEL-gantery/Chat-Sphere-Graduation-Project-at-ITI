const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRouter =require('./routes/authRoutes')
const DB = require('./dataBase');
dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`MOD :${process.env.NODE_ENV} `);
}
app.use('/',authRouter)
const PORT = process.env.PORT;
const URL = process.env.DATA_BASE_URL;

DB(URL);
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT : ${PORT}`);
});

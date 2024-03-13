const mongoose = require('mongoose');

const connect = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log('DB Connected Successfully');
    })
    .catch((err) => {
      console.log('ERROR 💥', err);
    });
};

module.exports = connect;

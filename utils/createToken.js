const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
  });
};

const createToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

module.exports = { signToken, createToken };

const joi = require('joi');

exports.newUser = (user) => {
  const schema = joi.object({
    name: joi.string().required().min(3).trim(),
    email: joi.string().required().email(),
    password: joi.string().required().min(8),
    passwordConfirm: joi.string().required().valid(joi.ref('password')),
  });

  return schema.validate(user);
};

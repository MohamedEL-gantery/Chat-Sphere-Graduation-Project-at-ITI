const joi = require('joi');

exports.newUser = (user) => {
  const schema = joi.object({
    name: joi.string().required().min(3).trim(),
    email: joi.string().required().email(),
    password: joi
      .string()
      .required()
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;<>,.?~\\|\-])[A-Za-z\d!@#$%^&*()_+={}\[\]:;<>,.?~\\|\-]{8,}$/
      )
      .message(
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol, and must be at least 8 characters long.'
      ),
    passwordConfirm: joi.string().required().valid(joi.ref('password')),
  });

  return schema.validate(user);
};

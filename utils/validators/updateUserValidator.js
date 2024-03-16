const joi = require('joi');

exports.updateUser = (user) => {
  const schema = joi.object({
    name: joi.string().min(3).trim(),
    email: joi.string().email(),
    photo: joi.string(),
    age: joi.number(),
    phoneNumber: joi.string().max(11),
    gender: joi.string(),
    birthDay: joi.date(),
    location: joi.string(),
  });

  return schema.validate(user);
};

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name Must Be Required'],
      minlength: [3, 'Name Must Have More OR Equal then 3 Characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email Must Be Required'],
      validate: [validator.isEmail, 'Enter A Valid Email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password Must Be Required'],
      validate: [validator.isStrongPassword, 'Enter A Strong Password'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'PasswordConfirm Must Be Required'],
      validate: {
        validator: (value) => {
          return value === this.password;
        },
        message: 'Password Are Not The Same',
      },
    },
    photo: String,
    age: {
      type: Number,
      validate: {
        validator: (value) => {
          return validator.isInt(String(value));
        },
        message: 'Enter A Valid Age',
      },
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: (value) => {
          return validator.isMobilePhone(value, 'ar-EG');
        },
        message: 'Invalid PhoneNumber For Egypt',
      },
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      message: 'Gender must be Male or Female',
    },
    birthDay: {
      type: Date,
      validate: [validator.isDate, 'Enter A Valid Date'],
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    location: String,
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    facebookId: String,
    googleId: String,
    passwordChangedAt: Date,
    passwordResetExpires: Date,
    passwordResetCode: String,
    passwordResetVerified: Boolean,
    signupResetExpires: Date,
    signupResetCode: String,
    signupResetVerified: Boolean,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified(this.password)) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.CheckPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

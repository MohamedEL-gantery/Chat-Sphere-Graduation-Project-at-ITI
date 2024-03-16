const crypto = require('crypto');
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
        validator: function (value) {
          return value === this.password;
        },
        message: 'Password Are Not The Same',
      },
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
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
    location: String,
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
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JwtTimeStamp) {
  if (this.passwordChangedAt) {
    const timePasswordChanged = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JwtTimeStamp < timePasswordChanged;
  }
  return false;
};

userSchema.methods.createVerifySignUpCode = function () {
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

  this.signupResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  this.signupResetExpires = Date.now() + 10 * 60 * 1000;
  this.signupResetVerified = false;
  return resetCode;
};

userSchema.methods.createResetCode = function () {
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

  this.passwordResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  this.passwordResetVerified = false;

  return resetCode;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

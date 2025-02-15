const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');

const userSchema = new mongoose.Schema({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    avatarURL:{
      type: String,
    },
    token: String,
    
  });


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

userSchema.methods.createAvatar = (email) => {
  this.avatarURL = gravatar.url(email, {s: '250'});
};

const User = mongoose.model('User', userSchema);

module.exports = User;
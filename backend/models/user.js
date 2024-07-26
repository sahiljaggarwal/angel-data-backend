const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  action: {
    type: String,
  },
});
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  task: [TaskSchema],
  userSignedAggrementUrl: {
    type: String,
  },

  isAgree: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", UserSchema);

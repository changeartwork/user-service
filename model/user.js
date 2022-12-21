const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name not provided "],
    },
    email: {
      type: String,
      unique: [true, "Email already exists in database!"],
      lowercase: true,
      trim: true,
      required: [true, "Email not provided"],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: '{VALUE} is not a valid email!'
      }

    },
    role: {
      type: String,
      enum: ["client", "admin", "super-admin"],
      required: [true, "Please specify user role"]
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('user', userSchema);
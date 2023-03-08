const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const clientSchema = new mongoose.Schema(
  {
    profile: [{
      first_name: {
        type: String,
        required: [true, "First Name is required"],
      },
      last_name: {
        type: String,
        required: [true, "Last Name is required"],
      },
      email: {
        type: String,
        unique: [true, "Email already exists in database"],
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
      avatar: {
        type: String,
        default: "http://dev.changeartwork.com/images/assets/avatar.jpg"
      },
      profile_status: {
        type: String,
        default: "INACTIVE",
        enum: ["ACTIVE", "INACTIVE"]
      }
    }],
    role: {
      type: String,
      default: "client"
    },
    client_status: {
      type: String,
      default: "INACTIVE",
      enum: ["ACTIVE", "INACTIVE"]
    },
    password: {
      type: String,
      required: true
    },
    business_name: {
      type: String
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required"]
    },
    payment_terms_in_days: {
      type: String,
      enum: ["7", "15", "30"],
      required: [true, "Payment terms is required"]
    },
    currency_code: {
      type: String,
      enum: ["USD", "CAD", "GBP"],
      required: [true, "Currency code is required"]
    },
    payment_mode: {
      type: String,
      enum: ["CC", "CCF", "PP", "CQ", "ACT"],
      required: [true, "Payment mode is required"]
    },
    city: {
      type: String,
      required: [true, "City is required"]
    },
    state: {
      type: String,
      required: [true, "State is required"]
    },
    country: {
      type: String,
      required: [true, "Country code is required"]
    },
    zipcode: {
      type: String,
      required: [true, "Zip Code is required"]
    }
  },
  { timestamps: true },
  { _id: false }
);

clientSchema.plugin(AutoIncrement, {inc_field: 'client_id'});



module.exports = mongoose.model('client', clientSchema);
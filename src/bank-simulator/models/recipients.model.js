const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipientSchema = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    rut: {
      type: String,
      require: true,
      unique: true
    },
    email: {
      type: String,
      require: true
    },
    phoneNumber: {
      type: String,
      require: true
    },
    destinyBank: {
      type: String,
      require: true
    },
    accountType: {
      type: String,
      require: true
    },
    accountNumber: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
)

const model = mongoose.model('Recipient', recipientSchema);
module.exports = model;
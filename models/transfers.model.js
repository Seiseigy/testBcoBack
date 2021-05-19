const mongoose = require('mongoose');

const { Schema } = mongoose;

const transferSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'Recipient',
      require: true
    },
    amount: {
      type: Number,
      require: true
    },
  },
  {
    timestamps: true
  }
)

const model = mongoose.model('Transfer', transferSchema);
module.exports = model;
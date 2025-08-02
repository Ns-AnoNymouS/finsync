const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    party: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Others',
    },
    type: {
      type: String,
      enum: ['income', 'expenditure'],
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'upi', 'other'],
      default: 'cash',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON, { preserveTimestamps: true });
transactionSchema.plugin(paginate);

module.exports = mongoose.model('Transaction', transactionSchema);

const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['income', 'expenditure'], required: true },
    color: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, userId: 1 }, { unique: true }); // unique per user

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);

module.exports = mongoose.model('Category', categorySchema);

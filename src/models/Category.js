const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80, unique: true },
  description: { type: String, trim: true, maxlength: 300, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

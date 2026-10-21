const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  content: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categories: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    required: true,
    validate: {
      validator: (categories) => categories.length > 0,
      message: 'At least one category is required',
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

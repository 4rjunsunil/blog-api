const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ data: categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name.trim(),
    description: req.body.description === undefined ? '' : req.body.description.trim(),
  });
  res.status(201).json({ data: category });
});

module.exports = { listCategories, createCategory };

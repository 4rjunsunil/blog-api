const Category = require('../models/Category');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/httpError');
const { isValidObjectId } = require('mongoose');

async function ensureCategoriesExist(categoryIds) {
  const categories = await Category.countDocuments({ _id: { $in: categoryIds } });
  if (categories !== new Set(categoryIds.map(String)).size) {
    throw new HttpError(400, 'One or more categories do not exist');
  }
}

function postFields(body) {
  return {
    title: body.title.trim(),
    content: body.content.trim(),
    categories: [...new Set(body.categories)],
  };
}

const listPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'name')
    .populate('categories', 'name description')
    .sort({ createdAt: -1 });
  res.json({ data: posts });
});

const getPost = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new HttpError(400, 'Post ID is invalid');
  }
  const post = await Post.findById(req.params.id)
    .populate('author', 'name')
    .populate('categories', 'name description');
  if (!post) {
    throw new HttpError(404, 'Post not found');
  }
  res.json({ data: post });
});

const createPost = asyncHandler(async (req, res) => {
  const fields = postFields(req.body);
  await ensureCategoriesExist(fields.categories);
  const post = await Post.create({ ...fields, author: req.user.id });
  const populatedPost = await Post.findById(post.id)
    .populate('author', 'name')
    .populate('categories', 'name description');
  res.status(201).json({ data: populatedPost });
});

const updatePost = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new HttpError(400, 'Post ID is invalid');
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new HttpError(404, 'Post not found');
  }
  if (post.author.toString() !== req.user.id) {
    throw new HttpError(403, 'Only the post creator can update it');
  }

  const fields = postFields(req.body);
  Object.assign(post, fields);
  await ensureCategoriesExist(fields.categories);
  await post.save();

  const populatedPost = await Post.findById(post.id)
    .populate('author', 'name')
    .populate('categories', 'name description');
  res.json({ data: populatedPost });
});

const deletePost = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new HttpError(400, 'Post ID is invalid');
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new HttpError(404, 'Post not found');
  }
  if (post.author.toString() !== req.user.id) {
    throw new HttpError(403, 'Only the post creator can delete it');
  }
  await post.deleteOne();
  res.status(204).end();
});

module.exports = { listPosts, getPost, createPost, updatePost, deletePost };

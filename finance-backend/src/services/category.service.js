const { Category } = require('../models');

const createCategory = async (data) => {
  return await Category.create(data);
};

const getAllCategories = async (userId) => {
  return await Category.find({ userId }).sort({ createdAt: -1 });
};

const getCategoryById = async (id, userId) => {
  return await Category.findOne({ _id: id, userId });
};

const updateCategory = async (id, userId, data) => {
  return await Category.findOneAndUpdate({ _id: id, userId }, data, { new: true });
};

const deleteCategory = async (id, userId) => {
  return await Category.findOneAndDelete({ _id: id, userId });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

const { categoryService } = require('../services');

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory({
      ...req.body,
      userId: req.user.id,
    });

    return res.status(201).json({ category });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories(req.user.id);
    return res.status(200).json({ categories });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id, req.user.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json({ category });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.user.id, req.body);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json({ category });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id, req.user.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };

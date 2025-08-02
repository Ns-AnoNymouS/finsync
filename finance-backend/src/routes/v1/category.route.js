const express = require('express');

const router = express.Router();
const { categoryController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');

const { categoryValidation } = require('../../validations');

router
  .route('/')
  .post(auth(), validate(categoryValidation.createCategorySchema), categoryController.createCategory)
  .get(auth(), categoryController.getAllCategories);
router
  .route('/:id')
  .put(auth(), validate(categoryValidation.updateCategorySchema), categoryController.updateCategory)
  .delete(auth(), categoryController.deleteCategory);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing income and expense categories
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *                 example: Food
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               color:
 *                 type: string
 *                 example: "#FF7043"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 *
 *   get:
 *     summary: Get all categories of authenticated user
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64d7c251f495330d882d2d5a"
 *         name:
 *           type: string
 *           example: Rent
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           example: expense
 *         color:
 *           type: string
 *           example: "#F4B400"
 *         userId:
 *           type: string
 *           example: "64d7c12b98c21f58e2cce9a4"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

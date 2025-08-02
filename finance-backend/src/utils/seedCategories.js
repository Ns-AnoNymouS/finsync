const { Category } = require('../models');

const incomeCategories = ['Salary', 'Bonus', 'Interest', 'Investment'];
const expenseCategories = ['Food', 'Transport', 'Rent', 'Utilities', 'Health'];
const COLORS = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1', '#FF7043', '#9E9D24'];

async function seedCategories(userId) {
  if (!userId) throw new Error('User ID is required to seed categories');

  try {
    const existing = await Category.find({ userId });

    if (existing.length > 0) {
      return;
    }

    const categoriesToCreate = [];

    incomeCategories.forEach((name, idx) => {
      categoriesToCreate.push({
        name,
        type: 'income',
        color: COLORS[idx % COLORS.length],
        userId,
      });
    });

    expenseCategories.forEach((name, idx) => {
      categoriesToCreate.push({
        name,
        type: 'expenditure',
        color: COLORS[(incomeCategories.length + idx) % COLORS.length],
        userId,
      });
    });

    await Category.insertMany(categoriesToCreate);
  } catch (err) {
    console.error(`❌ Error seeding categories for user ${userId}:`, err);
    throw err;
  }
}

module.exports = seedCategories;

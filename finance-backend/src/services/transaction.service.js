const httpStatus = require('http-status');
const dayjs = require('dayjs');
const mongoose = require('mongoose');
const { Transaction } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a transaction
 * @param {Object} transactionBody
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (transactionBody) => {
  return Transaction.create(transactionBody);
};

/**
 * Create multiple transactions
 * @param {Array<Object>} transactions
 * @returns {Promise<Array<Transaction>>}
 */
const createBulkTransactions = async (transactions) => {
  return Transaction.insertMany(transactions);
};

/**
 * Get transaction by id for a specific user
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<Transaction>}
 */
const getTransactions = async (filter, options) => {
  const { fromDate, toDate, party, paymentMethod, ...restFilters } = filter;

  // Apply date filter
  if (fromDate || toDate) {
    restFilters.createdAt = {};
    if (fromDate) restFilters.createdAt.$gte = new Date(fromDate);
    if (toDate) restFilters.createdAt.$lte = new Date(toDate);
  }

  // Apply party name filter (case-insensitive)
  if (party) {
    restFilters.party = { $regex: party, $options: 'i' };
  }

  // Handle paymentMethod as string or array
  if (paymentMethod) {
    restFilters.paymentMethod = Array.isArray(paymentMethod) ? { $in: paymentMethod } : paymentMethod;
  }

  // Paginated data
  const paginatedResult = await Transaction.paginate(restFilters, options);

  // Aggregated totals
  const totals = await Transaction.aggregate([
    { $match: restFilters },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpenditure = 0;
  let totalTransactions = 0;

  for (const item of totals) {
    if (item._id === 'income') totalIncome = item.totalAmount;
    if (item._id === 'expenditure') totalExpenditure = item.totalAmount;
    totalTransactions += item.count;
  }

  const totalBalance = totalIncome - totalExpenditure;

  // 💡 Income breakdown by category
  const incomeBreakdown = await Transaction.aggregate([
    { $match: { ...restFilters, type: 'income' } },
    {
      $group: {
        _id: '$category',
        value: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        value: 1,
        count: 1,
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  // 💡 Expenditure breakdown by category
  const expenditureBreakdown = await Transaction.aggregate([
    { $match: { ...restFilters, type: 'expenditure' } },
    {
      $group: {
        _id: '$category',
        value: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        value: 1,
        count: 1,
      },
    },
    { $sort: { value: -1 } },
  ]);

  return {
    ...paginatedResult,
    totalIncome,
    totalExpenditure,
    totalTransactions,
    totalBalance,
    incomeBreakdown,
    expenditureBreakdown,
  };
};

/**
 * Get transaction by id for a specific user
 * @param {ObjectId} userId
 * @param {ObjectId} transactionId
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (userId, transactionId) => {
  return Transaction.findOne({ _id: transactionId, userId });
};

const getTransactionStatsService = async (userId, period) => {
  let groupId;
  let dateFrom;
  const now = new Date();

  // Ensure userId is ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid userId');
  }

  const objectUserId = new mongoose.Types.ObjectId(userId);

  if (period === 'weekly') {
    groupId = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    dateFrom = dayjs().subtract(6, 'day').startOf('day').toDate();
  } else if (period === 'monthly') {
    groupId = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    dateFrom = dayjs().subtract(11, 'month').startOf('month').toDate();
  } else if (period === 'yearly') {
    groupId = { $dateToString: { format: '%Y', date: '$createdAt' } };
    dateFrom = dayjs().subtract(4, 'year').startOf('year').toDate();
  } else {
    throw new Error('Invalid period');
  }

  console.log('Fetching stats from:', dateFrom.toISOString());

  const stats = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: dateFrom },
        userId: objectUserId,
      },
    },
    {
      $group: {
        _id: {
          date: groupId,
          type: '$type', // 'income' or 'expenditure'
        },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.date': 1 } },
  ]);

  const result = {};
  stats.forEach((item) => {
    const { date } = item._id;
    const { type } = item._id;
    if (!result[date]) result[date] = { income: 0, expenditure: 0 };
    result[date][type] = item.totalAmount;
  });

  return Object.entries(result).map(([date, values]) => ({
    date,
    income: values.income || 0,
    expenditure: values.expenditure || 0,
  }));
};

/**
 * Update transaction by id for a specific user
 * @param {ObjectId} userId
 * @param {ObjectId} transactionId
 * @param {Object} updateBody
 * @returns {Promise<Transaction>}
 */
const updateTransactionById = async (userId, transactionId, updateBody) => {
  const transaction = await getTransactionById(userId, transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  Object.assign(transaction, updateBody);
  await transaction.save();
  return transaction;
};

/**
 * Delete transaction by id for a specific user
 * @param {ObjectId} userId
 * @param {ObjectId} transactionId
 * @returns {Promise<Transaction>}
 */
const deleteTransactionById = async (userId, transactionId) => {
  const transaction = await getTransactionById(userId, transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  await transaction.remove();
  return transaction;
};

module.exports = {
  createTransaction,
  createBulkTransactions,
  getTransactions,
  getTransactionById,
  getTransactionStatsService,
  updateTransactionById,
  deleteTransactionById,
};

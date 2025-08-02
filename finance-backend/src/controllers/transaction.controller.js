const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService, fileService, geminiService, categoryService } = require('../services');

const createTransaction = catchAsync(async (req, res) => {
  const data = { ...req.body, userId: req.user._id };
  const transaction = await transactionService.createTransaction(data);
  res.status(httpStatus.CREATED).send(transaction);
});

const createBulkTransactions = catchAsync(async (req, res) => {
  const transactionsWithUser = req.body.map((t) => ({
    ...t,
    userId: req.user._id,
  }));
  const result = await transactionService.createBulkTransactions(transactionsWithUser);
  res.status(httpStatus.CREATED).send(result);
});

const getUserTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category', 'type', 'party', 'amount', 'paymentMethod ', 'fromDate', 'toDate']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  filter.userId = req.user._id; // Ensure transactions are filtered by the logged-in user
  const result = await transactionService.getTransactions(filter, options);
  res.send(result);
});

const getTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.user._id, req.params.transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.send(transaction);
});

const getTransactionStats = async (req, res) => {
  try {
    const period = req.query.period || 'weekly'; // default to weekly
    const userId = req.user.id;
    const data = await transactionService.getTransactionStatsService(userId, period);
    res.json(data);
  } catch (err) {
    console.error('Transaction stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

const updateTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.updateTransactionById(req.user._id, req.params.transactionId, req.body);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.send(transaction);
});

const deleteTransaction = catchAsync(async (req, res) => {
  const deleted = await transactionService.deleteTransactionById(req.user._id, req.params.transactionId);
  if (!deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.status(httpStatus.NO_CONTENT).send();
});

const extractTransactions = async (req, res) => {
  const { file } = req;
  if (!file) return res.status(400).json({ error: 'File is required' });

  try {
    const extractedText = await fileService.extractTextFromFile(file);
    const rawCategories = await categoryService.getAllCategories(req.user.id);
    const categories = {
      income: rawCategories.filter((c) => c.type === 'income').map((c) => c.name),
      expenditure: rawCategories.filter((c) => c.type === 'expenditure').map((c) => c.name),
    };
    const transactions = await geminiService.extractTransactions(extractedText, categories);

    return res
      .status(200)
      .json(
        Array.isArray(transactions)
          ? transactions.length === 1
            ? { transaction: transactions[0] }
            : { transactions }
          : { transaction: transactions }
      );
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
module.exports = {
  createTransaction,
  createBulkTransactions,
  getUserTransactions,
  getTransaction,
  getTransactionStats,
  updateTransaction,
  deleteTransaction,
  extractTransactions,
};

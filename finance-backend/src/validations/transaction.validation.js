const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTransaction = {
  body: Joi.object().keys({
    party: Joi.string().trim(),
    category: Joi.string().required(),
    paymentMethod: Joi.string().valid('cash', 'card', 'bank_transfer', 'upi', 'other').default('cash'),
    type: Joi.string().valid('income', 'expenditure').required(),
    currency: Joi.string().default('INR'),
    amount: Joi.number().min(0).required(),
    description: Joi.string().allow('', null),
    createdAt: Joi.date()
      .iso()
      .default(() => new Date()),
  }),
};

const createBulkTransactions = {
  body: Joi.array()
    .items(
      Joi.object().keys({
        party: Joi.string().trim(),
        category: Joi.string().required(),
        paymentMethod: Joi.string().valid('cash', 'card', 'bank_transfer', 'upi', 'other').default('cash'),
        type: Joi.string().valid('income', 'expenditure').required(),
        currency: Joi.string().default('INR'),
        amount: Joi.number().min(0).required(),
        description: Joi.string().allow('', null),
        createdAt: Joi.date()
          .iso()
          .default(() => new Date()),
      })
    )
    .min(1)
    .required(),
};

const getTransactions = {
  query: Joi.object().keys({
    party: Joi.string().trim(),
    type: Joi.string().valid('income', 'expenditure'),
    category: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    paymentMethod: Joi.alternatives().try(
      Joi.string().valid('cash', 'card', 'bank_transfer', 'upi', 'other'),
      Joi.array().items(Joi.string().valid('cash', 'card', 'bank_transfer', 'upi', 'other'))
    ),
    fromDate: Joi.date().iso().optional(), // ISO 8601 date string
    toDate: Joi.date()
      .iso()
      .optional()
      .custom((value, helpers) => {
        const { fromDate } = helpers.state.ancestors[0];

        if (fromDate && new Date(value) < new Date(fromDate)) {
          return helpers.error('date.min', { limit: fromDate });
        }

        return value;
      })
      .messages({
        'date.base': 'toDate must be a valid ISO date',
        'date.min': 'To Date must be equal to or after From Date',
      }),
    amount: Joi.number(),
  }),
};

const getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required().custom(objectId),
  }),
};

const updateTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      party: Joi.string().trim(),
      category: Joi.string(),
      type: Joi.string().valid('income', 'expenditure'),
      currency: Joi.string(),
      amount: Joi.number().min(0),
      paymentMethod: Joi.string().valid('cash', 'card', 'bank_transfer', 'upi', 'other'),
      description: Joi.string().allow('', null),
      createdAt: Joi.date().iso(),
    })
    .min(1),
};

const deleteTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createTransaction,
  createBulkTransactions,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};

const Joi = require('joi');

exports.createCategorySchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('income', 'expenditure').required(),
  color: Joi.string().required(),
});

exports.updateCategorySchema = Joi.object({
  name: Joi.string(),
  type: Joi.string().valid('income', 'expenditure'),
  color: Joi.string(),
});

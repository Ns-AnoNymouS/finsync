const express = require('express');

const router = express.Router();
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { transactionValidation } = require('../../validations');
const { transactionController } = require('../../controllers');

const upload = multer({ dest: 'uploads/' });
function parseQueryArrays(req, res, next) {
  if (req.query.paymentMethod && typeof req.query.paymentMethod === 'string') {
    try {
      const parsed = JSON.parse(req.query.paymentMethod);
      if (Array.isArray(parsed)) {
        req.query.paymentMethod = parsed;
      }
    } catch (e) {
      // ignore parse error, let Joi handle invalid input
    }
  }
  next();
}

router
  .route('/')
  .post(auth(), validate(transactionValidation.createTransaction), transactionController.createTransaction)
  .get(auth(), parseQueryArrays, validate(transactionValidation.getTransactions), transactionController.getUserTransactions);

router.get('/stats', auth(), transactionController.getTransactionStats);
router.post(
  '/bulk',
  validate(transactionValidation.createBulkTransactions),
  auth(),
  transactionController.createBulkTransactions
);

router
  .route('/:transactionId')
  .get(auth(), validate(transactionValidation.getTransaction), transactionController.getTransaction)
  .put(auth(), validate(transactionValidation.updateTransaction), transactionController.updateTransaction)
  .delete(auth(), validate(transactionValidation.deleteTransaction), transactionController.deleteTransaction);

router.route('/extract').post(auth(), upload.single('file'), transactionController.extractTransactions);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Manage user transactions
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction
 *     description: Authenticated users can add income or expenditure transactions.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - type
 *               - amount
 *             properties:
 *               party:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [income, expenditure]
 *               amount:
 *                 type: number
 *                 minimum: 0
 *               currency:
 *                 type: string
 *                 default: INR
 *               description:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, bank_transfer, upi, other]
 *
 *             example:
 *               party: Amazon
 *               category: Shopping
 *               type: expenditure
 *               amount: 1500
 *               currency: INR
 *               description: Bought headphones
 *               paymentMethod: card
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Get user's transactions
 *     description: Fetch all transactions for the logged-in user with optional filters.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expenditure]
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *         enum: [cash, card, bank_transfer, upi, other]
 *         description: Filter by payment method
 *       - in: query
 *         name: amount
 *         schema:
 *           type: float
 *         description: Filter by amount
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from this date (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to this date (YYYY-MM-DD)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., amount:asc or createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *         description: Max number of results
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /transactions/bulk:
 *   post:
 *     summary: Create multiple transactions in bulk
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       "201":
 *         description: Transactions created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insertedCount:
 *                   type: number
 *                 message:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /transactions/stats:
 *   get:
 *     summary: Get income and expenditure stats (daily, monthly, yearly)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [weekly, monthly, yearly]
 *         required: true
 *         description: Time range to fetch statistics for
 *     responses:
 *       "200":
 *         description: Income and expenditure data by time period
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 income:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       total:
 *                         type: number
 *                 expenditure:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       total:
 *                         type: number
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       "200":
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payee:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [income, expenditure]
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, bank_transfer, upi, other]
 *               description:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Updated transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       "200":
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

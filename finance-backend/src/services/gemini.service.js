const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash-latest' });

/**
 * Extracts structured transactions from bank statement text.
 * @param {string} text - Raw bank statement.
 * @param {{ income: string[], expenditure: string[] }} categories - User-defined categories.
 */
exports.extractTransactions = async (text, categories) => {
  const prompt = `
Given the following text, extract all financial transactions with these fields:
- date
- party
- amount
- type ("income" or "expenditure")
- paymentMethod ('cash' or 'card' or 'bank_transfer' or 'upi' or 'other') strictly use this only and choose the most accurate
- category (choose the most accurate)

Special Instructions:
1. The text may either be a **bank statement** (with multiple transactions) or a **bill/receipt** (a single consolidated payment).
2. If it's a **bill or receipt**, consider it as a **single payment**, and extract it as one transaction only.
3. If it's a **bank statement**, extract **each transaction separately**.
4. Do not include "Uncategorized" as a category. Choose the most accurate one from the provided lists.
5. Match the category based on the nature of the transaction:
   - If type is "income", choose from this income list: ${JSON.stringify(categories.income)}.
   - If type is "expenditure", choose from this expenditure list: ${JSON.stringify(categories.expenditure)}.

Respond ONLY in this JSON array format:
[
  {
    "date": "01/01/2024",
    "party": "Amazon",
    "paymentMethod": "card",
    "amount": 1200.00,
    "type": "expenditure",
    "category": "Shopping"
  },
  {
    "date": "03/03/2024",
    "party": "Biryani Hub",
    "paymentMethod": "upi",
    "amount": 1500.00,
    "type": "expenditure",
    "category": "Food"
  }
]

Text:
"""${text}"""
`;

  const result = await model.generateContent(prompt);
  const { response } = result;
  const content = response.text();

  try {
    return JSON.parse(content);
  } catch (e) {
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
    throw new Error('Gemini did not return valid JSON');
  }
};

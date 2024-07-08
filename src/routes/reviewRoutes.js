const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getReviewsByBook, createReview } = require('../controllers/reviewController');
const reviewRouter = express.Router();


/**
 * @swagger
 * /reviews/book/{bookId}:
 *   get:
 *     summary: Get all reviews by book ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all reviews for the book
 */
reviewRouter.get('/book/:bookId', authenticate, getReviewsByBook);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               customerId:
 *                 type: integer
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Review created successfully
 */
reviewRouter.post('/', authenticate, createReview);

module.exports = reviewRouter;
const express = require('express');
const { getBookById, getAllBooks, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const bookRouter = express.Router();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of books to return per page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: title
 *         required: false
 *         description: Filter books by title
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         required: false
 *         description: Filter books by author
 *         schema:
 *           type: string
 *       - in: query
 *         name: genre
 *         required: false
 *         description: Filter books by genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: Field to sort books by (e.g., title, author)
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         description: Order of sorting (asc or desc)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of books
 *       500:
 *         description: Error fetching books
 */
bookRouter.get('/', authenticate, getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get Single Book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 */
bookRouter.get('/:id', authenticate, getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book created successfully
 */
bookRouter.post('/', authenticate, authorize(['admin']), createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
bookRouter.put('/:id', authenticate, authorize(['admin']), updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
bookRouter.delete('/:id', authenticate, authorize(['admin']), deleteBook);

module.exports = bookRouter;

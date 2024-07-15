const eventEmitter = require("../../eventEmitter");
const Book = require("../models/mongo/book");
const { paginate } = require("../utils/paginate");

exports.getAllBooks = async (req, res) => {
    const { page = 1, limit = 5, title, author, genre, sortBy, sortOrder } = req.query;

    try {
        // Build filter criteria
        const filter = {};
        if (title) filter.title = { $regex: title, $options: 'i' }; // Case insensitive
        if (author) filter.author = { $regex: author, $options: 'i' };
        if (genre) filter.genre = genre;

        // Determine sorting
        const sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1; // Default to ascending if not specified
        }

        const booksCount = await Book.countDocuments(filter); // Count filtered books
        const books = await Book.find(filter)
            .sort(sort) // Apply sorting
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const paginatedResult = paginate(booksCount, page, limit);

        res.status(200).json({
            books,
            pagination: paginatedResult,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book',error: error.message });
    }
};

exports.createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        eventEmitter.emit('newBook',book)
        res.status(201).json({message:"book successfully created.",book});
    } catch (error) {
        res.status(400).json({ message: 'Error creating book', error: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
};
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    customerId: Number,
    review: String,
    rating: Number
});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;
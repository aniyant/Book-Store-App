const {mongoose } = require("mongoose");
const Review = require("../models/mongo/review");
const Customer = require("../models/sql/customer");


exports.getReviewsByBook = async (req,res) => {
    const { bookId } = req.params;
    try {
        const reviews = await Review.find({ bookId: new mongoose.Types.ObjectId(bookId) });
        console.log(reviews);
        if(!reviews.length){
            return res.status(200).json(reviews);  // Return 404 if no reviews are found for the given bookId. 400 would be more appropriate if the bookId was invalid. 500 is used for server errors.  //
        }
        res.json(reviews);
    } catch (error) {
        res.status(500).json({message:"Error in Reviews" ,error: error.message });
    }
}

exports.createReview = async (req, res) => {
    const { bookId, customerId, rating, review } = req.body;
    try {
        const customer = await Customer.findByPk(customerId);
        if(!customer){
            return res.status(404).json({ message: 'Customer not found' });  // Return 404 if the customerId is invalid. 400 would be more appropriate if the bookId was invalid. 500 is used for server errors.  //
        }
        const reviewDoc = new Review({ bookId, customerId:customer.id, rating, review });
        await reviewDoc.save();
        res.status(201).json(reviewDoc);
    } catch (error) {
        res.status(400).json({ message: "Invalid review data", error: error.message });
    }
}
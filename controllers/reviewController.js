const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {

        const { id } = req.params;

        // FIND LISTING
        let listing = await Listing.findById(id);

        // CHECK LISTING EXISTS
        if (!listing) {

            throw new ExpressError("Listing not found", 404);

        }

        // CREATE REVIEW
        let review = new Review(req.body.review);
        review.author = req.user._id;

        // PUSH REVIEW
        listing.reviews.push(review);

        // SAVE
        await review.save();

        await listing.save();
        req.flash("success", "Review added successfully!");

        // REDIRECT
        res.redirect(`/listings/${listing._id}`);

    };

module.exports.deleteReview = async (req, res) => {

        const { id, reviewId } = req.params;

        // REMOVE REVIEW ID FROM LISTING
        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });

        // DELETE REVIEW
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted successfully!");

        // REDIRECT
        res.redirect(`/listings/${id}`);

    };    
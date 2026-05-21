const express = require("express");

const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const {validateReview,isLoggedIn,isReviewAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/reviewController.js");


// ==============================
// POST REVIEW ROUTE
// ==============================
router.post(
    "/",
    isLoggedIn,
    validateReview,

    wrapAsync(reviewController.createReview)
);


// ==============================
// DELETE REVIEW ROUTE
// ==============================
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,

    wrapAsync(reviewController.deleteReview)
);


module.exports = router;
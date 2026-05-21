const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: String,

    category: {
    type: String,
    enum: [
            "trending",
            "rooms",
            "city",
            "pools",
            "mountains",
            "lake",
            "forest",
            "beach",
            "camping",
            "topview",
            "cabins",
            "luxury",
            "snow",
            "relax"
        ],
    required: true
},
   geometry: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        default: [0, 0]
    }
},

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

// delete reviews when listing is deleted
listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapAsync.js');

const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listingController.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//index route + create new listing
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing,upload.single("image"), wrapAsync(listingController.createListing));


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ---------------- SEARCH SUGGESTIONS ----------------
router.get(
    "/search/suggestions",
    wrapAsync(listingController.searchSuggestions)
);

router.get(
    "/favorites",
    isLoggedIn,
    wrapAsync(listingController.favorites)
);
// ---------------- FAVORITE ----------------
router.post(
    "/:id/favorite",
    isLoggedIn,
    wrapAsync(listingController.toggleFavorite)
);


//show route + update route + delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing,upload.single("image"), wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
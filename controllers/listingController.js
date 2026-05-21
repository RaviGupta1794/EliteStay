const Listing = require("../models/listing.js");
const User = require("../models/user");

//
module.exports.index = async (req, res) => {

    let { q, category } = req.query;

    let filter = {};

    // Category filter
    if (category && category.trim()) {
        filter.category = category;
    }

    // Search filter
    if (q && q.trim()) {

        filter.$or = [
            { title: { $regex: q.trim(), $options: "i" } },
            { location: { $regex: q.trim(), $options: "i" } },
            { country: { $regex: q.trim(), $options: "i" } },
            { category: { $regex: q.trim(), $options: "i" } }
        ];

    }

    const allListings = await Listing.find(filter);
      let favorites = [];
    
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user) {
                favorites = user.favorites.map(f => f.toString());
            }
        }

    res.render("listings/index", {
        listings: allListings,
        q: q || "",
        category: category || "",
        favorites
    });

};
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  try {
    const listing = new Listing(req.body.listing);

    // owner
    listing.owner = req.user._id;

    // image
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    // 🔥 PASTE GEOCODING HERE (THIS IS THE EXACT PLACE)

    const query = `${listing.location}, ${listing.country}`;

    const geoResponse = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${process.env.MAPTILER_API_KEY}`
    );

    const geoData = await geoResponse.json();
    console.log(geoData);

    if (!geoData.features || geoData.features.length === 0) {
      req.flash("error", "Location not found. Try different name.");
      return res.redirect("/listings/new");
    }

    const coordinates = geoData.features[0].geometry.coordinates;

    listing.geometry = {
      type: "Point",
      coordinates: coordinates
    };

    // 🔥 SAVE LAST
    await listing.save();

    req.flash("success", "New Listing created successfully!");
    res.redirect("/listings");

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings/new");
  }
};
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {

        req.flash("error", "Listing you are looking for does not exist!");

        return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;

    // 1. update basic fields
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        {  returnDocument: "after" }
    );

    // 2. check if location changed OR missing geometry
    const query = `${listing.location}, ${listing.country}`;

    try {

        const geoResponse = await fetch(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${process.env.MAPTILER_API_KEY}`
        );

        const geoData = await geoResponse.json();

        if (geoData.features && geoData.features.length > 0) {
            listing.geometry = {
                type: "Point",
                coordinates: geoData.features[0].geometry.coordinates
            };
        }

    } catch (err) {
        console.log("GEOCODING ERROR (update):", err);
    }

    // 3. image update (if user uploads new one)
    if (typeof req.file !== "undefined") {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // 4. save final changes
    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {

        req.flash("error", "Listing you are looking for does not exist!");

        return res.redirect("/listings");
    }

    res.render("listings/show", { listing});

};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully");

    res.redirect("/listings");
};
// SEARCH SUGGESTIONS
module.exports.searchSuggestions = async (req, res) => {
    const { q } = req.query;

    if (!q) return res.json([]);

    const results = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    }).limit(5);

    res.json(results);
};

module.exports.favorites = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("favorites");

    res.render("listings/favorites", {
        listings: user.favorites
    });
};

// FAVORITES TOGGLE
module.exports.toggleFavorite = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const isFavorite = user.favorites.some(
        fav => fav.toString() === id
    );

    if (isFavorite) {
        user.favorites.pull(id);
    } else {
        user.favorites.push(id);
    }

    await user.save();

    res.json({ isFavorite: !isFavorite });
};
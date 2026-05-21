const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to EliteStay");
            res.redirect("/listings");
        });


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {

        req.flash(
            "success",
            "Welcome back To EliteStay!"
        );

        let redirectUrl =
            res.locals.redirectUrl || "/listings";

        res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You are logged out!"
        );

        res.redirect("/listings");

    });

};
// FAVORITES
module.exports.showFavorites = async (req, res) => {
    const user = await User.findById(req.user._id).populate("favorites");

    if (!user) {
        req.flash("error", "User not found!");
        return res.redirect("/listings");
    }

    res.render("users/favorites.ejs", {
        listings: user.favorites
    });
};
const User = require('../models/user');
const Campgrounds = require('../models/campground')
const Bookings = require('../models/book')
const seedDB = require('../seeds/index')

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    // req.session.destroy();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}

module.exports.seed = async (req,res)=>{
    if(req.user != undefined){
        await seedDB(req.user)
        req.flash('success','Seeded All Campgrounds')
        res.redirect('/campgrounds')
    }
    else{
        req.flash('error','Please login before seeding data')
        res.redirect('/campgrounds')
    }
}

module.exports.unseed = async (req,res)=>{
    await Campgrounds.deleteMany({})
    await Bookings.deleteMany({})
    req.flash('success','Unseeded All Campgrounds')
    res.redirect('/campgrounds')
}

module.exports.mybookings =async (req,res)=>{
    const booking = await User.findById(req.user._id).populate({
        path: 'bookings',
        populate : {
            path: 'bookingCampground'
        }
    })
    res.render('users/mybooking',{ bookings:booking.bookings })
}
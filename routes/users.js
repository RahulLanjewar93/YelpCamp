const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn, isAdmin } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout',isLoggedIn,users.logout)

router.get('/seed',isAdmin,isLoggedIn,users.seed)

router.get('/unseed',isAdmin,isLoggedIn,users.unseed)

router.get('/mybookings',isLoggedIn,users.mybookings)

module.exports = router;
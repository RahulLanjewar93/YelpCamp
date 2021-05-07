const express = require('express');
const router = express.Router({ mergeParams: true});
const {isLoggedIn,} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const booking = require('../controllers/bookings');


router.route('/')
    .get(isLoggedIn, catchAsync(booking.renderBookingForm))
    .post(isLoggedIn,catchAsync(booking.order))

router.post('/confirm',isLoggedIn,catchAsync(booking.addBooking))

module.exports = router;
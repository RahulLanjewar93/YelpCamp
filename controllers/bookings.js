const mongoose = require('mongoose')
const Campground = require('../models/campground')
const User = require('../models/user')
const Booking = require('../models/book')
const Razorpay = require('razorpay')
require('dotenv')

module.exports.renderBookingForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    order=null;
    res.render('campgrounds/booking', {campground,order})
}

module.exports.order = async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    const user = await User.findById(req.user._id)
    const bookingDate = req.body.booking.date;
    const check = await Booking.find({
        'bookingDate': {
            $eq: new Date(bookingDate)
        },
        'bookingCampground':{
            $eq:campground._id
        }
    })
    if (check.length === 0) {
        const razorpayConfig = {
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        }
        const instance = new Razorpay(razorpayConfig)
        const amount = req.body.booking.price*100;
        var orderConfig = {
            amount: amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11",
            notes:{
                'date':bookingDate
            }
        };
        instance.orders.create(orderConfig, function(err, order) {
            res.render('campgrounds/payment', {campground,order,RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID})
        });
    } else {
        req.flash('error', 'Campground Already booked for that date')
        res.redirect(`/campgrounds/${req.params.id}/book`)
    }

}

module.exports.addBooking = async (req, res) => {
    if(req.body.error){
        console.log(error)
        req.flash('error', 'Some Error Occured')
        res.redirect(`/campgrounds/${req.params.id}/book`)
    }else{
        const campground = await Campground.findById(req.params.id)
        const user = await User.findById(req.user._id)
        const bookingDate = req.body.booking.date;
        const check = await Booking.find({
            'bookingDate': {
                $eq: new Date(bookingDate)
            },
            'bookingCampground':{
                $eq:campground._id
            }
        })
        if (check.length === 0 ) {
            const booking = new Booking({
                bookingDate:bookingDate,
                bookingUser:req.user_id,
                bookingCampground:campground._id,
                orderId:req.body.response.razorpay_order_id,
                paymentId:b=req.body.response.razorpay_payment_id,
                amount:req.body.booking.price
            })
            await campground.bookings.push(booking)
            await user.bookings.push(booking)
            await booking.save()
            await campground.save()
            await user.save()
            req.flash('success', 'Campground  booked for that date')
            res.redirect(`/campgrounds/${req.params.id}/book`)
        } else {
            req.flash('error', 'Campground Already booked for that date')
            res.redirect(`/campgrounds/${req.params.id}/book`)
        }
    }
}
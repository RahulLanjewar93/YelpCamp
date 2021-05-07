const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    bookingDate: {
        type:Date
    },
    orderId: {
        type:String
    },
    paymentId: {
        type:String
    },
    bookingUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bookingCampground: {
        type:Schema.Types.ObjectId,
        ref:'Campground'
    },
    amount : {
        type:Number
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
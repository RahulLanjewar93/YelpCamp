const Razorpay = require('razorpay')
require('dotenv')

const razorpayConfig = {
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
}

const instance = new Razorpay(razorpayConfig)

module.exports.instance = instance;
module.exports.razorpayConfig = razorpayConfig;
const Razorpay = require('razorpay');
const Order = require('../models/order');

exports.premiumMembership = async (req, res, next) => {
    // console.log('rzr pay ==>' , req.body);
    // console.log('rzr pay user ==>' , req.user);
    try {
        // console.log('line num = 8 in puchase')
        let rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        })
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            try {
                if (err) {
                    throw new Error(JSON.stringify(err));
                }
                await req.user.createOrder({ orderId: order.id, status: 'PENDING' });
                console.log(`user's orderID ==> ${order.id}`);
                return res.status(201).json({ success : true , order, key_id: rzp.key_id });
            } catch (err) {
                console.log(`error ==>`, err);
                return res.status(404).json({success : false , message : 'Something went wrong' });
            }
        })
    } catch (err) {
        console.log(`error ==>`, err);
        return res.status(404).json({success : false , message : 'Something went wrong' });
    }
}

exports.updateTransection = async (req, res, next) => {
    // console.log(`line 35 in controller ==>` , req.body);
    const { order_id, payment_id, transaction } = req.body;

    try {
        const order = await Order.findOne({ where: { orderId: order_id } });
        if (transaction) {
            const success = order.update({ paymentId: payment_id, status: 'SECCESSFULL' });
            const premium = req.user.update({ isPremiumUser: true });
            await Promise.all([success, premium]);

            return res.status(201).json({ success: true, message: 'Transaction Successful' });
        } else {
            await order.update({ paymentId: 'FAILED', status: 'FAILED' });
            return res.status(201).json({ success: false, message: 'Transaction Failed' });
        }

    } catch (err) {
        console.log(err);
        return res.status(404).json({success : false , message : 'Something went wrong' });
    }
}
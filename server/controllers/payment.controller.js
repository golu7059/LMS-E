import "dotenv/config";
import Paymnet from "../models/payment.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import { razorpay } from "../server.js";
import crypto from 'crypto'

const getRazorpayApiKey = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "razor pay API key",
        key: process.env.RAZORPAY_KEY_ID
    })
}
const buySubscription = async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(new AppError("User doen't exist !", 400));
    }
    if (user.role == "ADMIN") {
        return next(new AppError("Admin has no need to Purchase subscription !", 400));
    }

    const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_notify: 1
    })
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status

    user.save();
    res.status(200).json({
        success: true,
        message: "Subscribed Successfully ",
        subscription_id: subscription.id
    })
}

const verifySubsription = async (req, res, next) => {
    const { id } = req.user;
    const { razorpay_payment_id, razorpay_signature, razorpaysubscription_id } = req.body;

    const user = await User.findById(id);
    if (!user) {
        return next(new AppError("User doen't exist !", 400));
    }
    try {

        const subscriptionId = user.subscription.id
        const generateSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id} | ${subscriptionId}`)
            .digest('hex')

        if (generateSignature !== razorpay_signature) {
            return next(new AppError("Payment not verified ! Please try Again", 400));
        }

        await Paymnet.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpaysubscription_id
        })

        user.subscription.status = 'active'
        await user.save();

        res.status(200).json({
            success: true,
            message: "Payment Verified successfully"
        })

    } catch (error) {
        return next(new AppError(`${error.message}`, 400))
    }
}

const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (!user) {
            return next(new AppError("User doen't exist !", 400));
        }
        if (user.role == "ADMIN") {
            return next(new AppError("Admin has no need to Purchase subscription !", 400));
        }

        const subscriptionId = user.subscription.id
        const subscription = await razorpay.subscriptions.cancel({
            subscriptionId
        })
        user.subscription.status = subscription.status;
        await user.save();

    } catch (error) {
        return next(new AppError(`${error.message}`, 400))
    }
}

const getAllPayments = async (req, res, next) => {
    try {
        const count = req.query;

        const subscriptions = await razorpay.subscriptions.all({
            count: count || 10
        })

        return res.status(200).json({
            success : true,
            message :"All payments",
            subscriptions
        })

    } catch (error) {
        return next(new AppError(`${error.message}`, 400))
    }

}

export {
    getRazorpayApiKey,
    buySubscription,
    verifySubsription,
    cancelSubscription,
    getAllPayments
}
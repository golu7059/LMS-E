import Router from 'express'
import { buySubscription, cancelSubscription, getAllPayments, getRazorpayApiKey, verifySubsription } from '../controllers/payment.controller';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware';

const router = Router();

router.route('/razorpay-key')
    .get(
        isLoggedIn,
        getRazorpayApiKey
    )

router.route('/subscribe')
    .post(
        isLoggedIn,
        buySubscription
    )

router.route('/verify')
    .post(
        isLoggedIn,
        verifySubsription
    )

router.route('/unsubscribe')
    .post(
        isLoggedIn,
        cancelSubscription
    )

router.route('/')
    .get(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        getAllPayments
    )

export default router;
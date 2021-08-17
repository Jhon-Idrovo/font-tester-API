import { NextFunction, Request, Response } from "express";
import { stripe } from "../config/stripe";
import { RequestEnhanced } from "../interfaces/utils";
import User from "../models/User";
import Stripe from "stripe";
import { TokenPayloadInterface } from "../interfaces/token";

/**
 * At this point the user is authenticated and it's information is
 * stored on req.decodedToken. Which is derived from the access token.
 */
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function createElementsSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { priceID, paymentMethod } = req.body;
  const { userID } = (req as RequestEnhanced).decodedToken;
  //we can only call this route if the user is logged in
  const user = await User.findById(userID).exec();
  try {
    //create customer. We need to save it's id to the database
    const customer = await stripe.customers.create({ email: user?.email });
    //attach the user's _id to the stripe customer. This help us later for retrieving
    //the user on webhooks
    customer.metadata._id = user?._id;
    //attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethod, {
      customer: customer.id,
    });
    //set the default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethod },
    });

    //create subscription
    // Note we're expanding the Subscription's
    // latest invoice and that invoice's payment_intent
    // so we can pass it to the front end to confirm the payment
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceID,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    //save the customer id to the database
    await user?.update({ stripeID: subscription.id }).exec();
    //stripe will try to make the transaction with the payment method provided previously
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.send({
      paymentIntent,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
}

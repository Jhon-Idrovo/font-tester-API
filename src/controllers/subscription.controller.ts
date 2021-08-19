import { NextFunction, Request, Response } from "express";
import { stripe } from "../config/stripe";
import { RequestEnhanced } from "../interfaces/utils";
import User from "../models/User";
import Stripe from "stripe";
import { getOrCreateCustomer } from "../utils/stripe";

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
  console.log(
    "-----------------------CREATING SUBSCRIPTION--------------------------"
  );

  const { priceId, paymentMethod } = req.body;
  const { userID } = (req as RequestEnhanced).decodedToken;
  //we can only call this route if the user is logged in
  const user = await User.findById(userID).exec();

  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });
  try {
    const customer = await getOrCreateCustomer(user);
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
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    //stripe will try to make the transaction with the payment method provided previously
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
    console.log(
      "-----------Subscription:",
      subscription,
      "----------Customer:",
      customer,
      "--------USER:",
      user
    );

    res.send({
      payment_intent: paymentIntent,
    });
  } catch (error) {
    console.log("-------------------ERROR CREATING SUBSCRIPTION: ", error);
    return res.status(400).send({ error: { message: error.message } });
  }
}

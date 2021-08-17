import { NextFunction, Response, Request } from "express";
import Stripe from "stripe";
import { stripe } from "../config/stripe";
import Role from "../models/Role";
import User from "../models/User";
/**
 * We do not run any middleware and the body is parsed as raw.
 * We already have the stripeID on the user.
 */
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function handleWebHook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req);

  // Retrieve the event by verifying the signature using the raw body and secret.
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"] as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.log(err);
    console.log(`⚠️  Webhook signature verification failed.`);
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
    return res.sendStatus(400);
  }
  // Extract the object from the event.
  const dataObject = event.data.object as Stripe.Invoice;

  // Retrieve the customer
  const customer = (await stripe.customers.retrieve(
    dataObject.customer as string
  )) as Stripe.Customer;
  // Handle the event type
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  switch (event.type) {
    case "invoce.payment_succeeded":
      console.log("--------PAYMENT SUCCEEDED------");
      //first payment succeeded, provision the subscription updating the user role
      const role = await Role.findOne({ name: "User" }).exec();
      const user = await User.findByIdAndUpdate(customer.metadata._id, {
        stripeID: customer.id,
        role: role?._id,
      });
      return res.send({ received: true });
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      console.log("--------PAYMENT FAILED------");
      //the user already has the role of "Guest".
      //send him an email?
      break;
    case "customer.subscription.deleted":
      if (event.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      break;
    default:
      // Unexpected event type
      break;
  }
  res.sendStatus(200);
}

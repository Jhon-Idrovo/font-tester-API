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
  console.log(
    "---------------------------HANDLING WEBHOOK--------------------------------"
  );

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
  const dataObject = event.data.object as Stripe.PaymentIntent;
  console.log(dataObject);

  // Retrieve the customer and user. If performence is needed put these calls on a single promise
  const customer = (await stripe.customers
    .retrieve(dataObject.customer as string)
    .catch((err) => null)) as Stripe.Customer;
  console.log(customer);

  if (!customer)
    return res.status(400).json({ error: { message: "No customer found" } });
  //we can use the email too since it's unique
  const user = await User.findById(customer.metadata._id).populate("role");
  if (!user)
    return res.status(400).json({ error: { message: "No user found" } });
  // Handle the event type
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  console.log(event.type);

  switch (event.type) {
    case "invoice.payment_succeeded":
      console.log("--------PAYMENT SUCCEEDED------");
      // This is trigered also when a recurring payment is made
      if (user.role.name === "User") return res.send({ received: true });
      //first payment succeeded, provision the subscription updating the user role
      const userRole = await Role.findOne({ name: "User" }).exec();
      if (!userRole)
        return res.status(400).json({ error: { message: "Role not found" } });
      user.role = userRole._id;
      user.stripeID = customer.id;
      const a = await user.save().catch((err) => null);
      if (!a)
        return res.status(400).json({
          error: { message: "Error updating the user role and stripeID" },
        });
      return res.send({ received: true });
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid.
      // This is snother way to handle the first payment
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      console.log("--------PAYMENT FAILED------");
      //If this is the first time, this is handled on the frontend
      if (user.stripeID) {
        // Recurrent payment failed by 3D secure
        if (dataObject.status === "requires_action") {
          // Send email notification of why the account was downgraded
          // Can this be done from the dashboard?
        }
        if (dataObject.status === "requires_payment_method") {
        }
      }
      //recurrent payment failed
      // const pastDueRole = await Role.findOne({ name: "User-PastDue" }).exec();
      // if (!pastDueRole)
      //   return res.status(400).json({ error: { message: "Role not found" } });
      // user.role = pastDueRole._id;
      // const b = await user.save().catch(() => null);
      // if (b)
      //   return res
      //     .status(400)
      //     .json({ error: { message: "Error updating the user role" } });
      break;
    case "customer.subscription.deleted":
      console.log("---------------------SUBSCRIPTION DELETED----------------");

      if (event.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      const guestRole = await Role.findOne({ name: "Guest" }).exec();
      if (!guestRole)
        return res
          .status(400)
          .json({ error: { message: "Guest role not found" } });
      user.role = guestRole._id;
      const c = await user.save().catch(() => null);
      if (c)
        return res
          .status(400)
          .json({ error: { message: "Error updating the user role" } });
      break;
    default:
      // Unexpected event type
      break;
  }
  res.sendStatus(200);
}

import { Document, ObjectId } from "mongoose";
import Stripe from "stripe";
import { stripe } from "../config/stripe";
import { UserIfc } from "../interfaces/users";
/**
 *
 * @param user MongoDB user
 * @returns stripe customer. User _id stored as metadata into it
 */
export async function getOrCreateCustomer(
  user: UserIfc & Document<any, any, UserIfc>
) {
  if (user.stripeID) {
    return await stripe.customers.retrieve(user.stripeID);
  }
  //create customer. We need to save it's id to the database
  //attach the user's _id to the stripe customer. This help us later for retrieving
  //the user on webhooks
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { _id: user._id.toString() },
  });
  //save the customer id to the database
  user.stripeID = customer.id;
  await user.save();
  return customer;
}

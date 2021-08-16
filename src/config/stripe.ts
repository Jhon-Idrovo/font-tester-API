import Stripe from "stripe";
//initialize stripe
export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: "2020-08-27",
});

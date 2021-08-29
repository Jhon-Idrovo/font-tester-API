import { NextFunction, Request, Response } from "express";
import { stripe } from "../config/stripe";
import { RequestEnhanced } from "../interfaces/utils";
import User from "../models/User";
import { getOrCreateCustomer } from "../utils/stripe";
import axiosPayPal from "../config/axiosPayPal";

/**
 * At this point the user is authenticated and it's information is
 * stored on req.decodedToken. Which is derived from the access token.
 */
export async function listPlans(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const r = await axiosPayPal.get(
      "/v1/billing/plans?product_id=PROD-6H551225VH0756808",
      { headers: { Prefer: "return=representation" } }
    );

    const plans = r.data.plans.filter((plan) => plan.status === "ACTIVE");

    return res.send({
      plans: plans.map((plan) => ({
        id: plan.id,
        displayName: plan.name,
        price: parseFloat(
          plan.billing_cycles[1].pricing_scheme.fixed_price.value
        ),
      })),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: { message: "Error retrieving prices" } });
  }
}
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function createSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(
    "-----------------------CREATING SUBSCRIPTION--------------------------"
  );

  const { userID } = (req as RequestEnhanced).decodedToken;
  const planId = req.params.planId;
  try {
    const r = await axiosPayPal.post("/v1/billing/subscriptions", {
      plan_id: planId,
      subscriber: { payer_id: userID },
    });
    res.status(201).json({ subscriptionId: r.data.id });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: { message: "Error creating subscription" } });
  }
}
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function activateSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const subscriptionId = req.params.subscriptionId;
  try {
    const r = await axiosPayPal.post(
      `/v1/billing/subscriptions/${subscriptionId}/activate`
    );
    console.log(r);

    return res.send(r.data);
  } catch (error) {
    console.log(error);

    return res
      .status(400)
      .json({ error: { message: "Error activating subscription" } });
  }
}
/**
 *Can be optimized since we retrieve the user
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function listSubscriptions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const user = await User.findById(userID).exec();
  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });
}
/**
 * Given the subscriptionId in the body, cancel the subscription
 * @param req
 * @param res
 * @param next
 * @returns Status code
 */
export async function cancelSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //const { userID } = (req as RequestEnhanced).decodedToken;
  const deleted = await stripe.subscriptions
    .del(req.body.subscriptionId)
    .catch((err) => null);
  return deleted ? res.send() : res.status(400).send();
}
/**
 * Given the new priceId and the subscriptionId in the body, update the subscription.
 * @param req
 * @param res
 * @param next
 * @returns Status code
 */
export async function updateSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.send();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: { message: "Unable to update" } });
  }
}

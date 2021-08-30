import { NextFunction, Request, Response } from "express";
import { stripe } from "../config/stripe";
import { RequestEnhanced } from "../interfaces/utils";
import User from "../models/User";
import { getOrCreateCustomer } from "../utils/stripe";
import axiosPayPal from "../config/axiosPayPal";
import { use } from "passport";
import {
  IPlan,
  IResponseSubscription,
  ISubscription,
} from "../interfaces/webhook_events";

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
      "/v1/billing/plans?product_id=PROD-2UV37604AU5086019",
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
 * Attach the subscriptionId to the user. Each subscription is unique on the db.
 * This ensures no subscription sharing.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function attachSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const { subscriptionId } = req.body;
  const user = await User.findById(userID).exec();
  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });
  user.subscriptionId = subscriptionId;
  try {
    await user.save();
    return res.send();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: { message: "Error attaching the subscription id", error },
    });
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

  try {
    const r = await axiosPayPal.get(
      `/v1/billing/subscriptions/${user.subscriptionId}`
    );
    const { id, plan_id, status, billing_info } = r.data as ISubscription;
    const r2 = await axiosPayPal.get(`/v1/billing/plans/${plan_id}`);
    const { billing_cycles, id: planId } = r2.data as IPlan;
    return res.json({
      subscription: {
        billingCycle: billing_cycles[1].frequency.interval_unit,
        status,
        id,
        nextBillingDate: billing_info.next_billing_time,
        planId,
        price: billing_cycles[1].pricing_scheme.fixed_price.value,
      } as IResponseSubscription,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: { message: "Error retrieving the subscription", error },
    });
  }
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
  const { userID } = (req as RequestEnhanced).decodedToken;
  const { subscriptionId } = req.body;

  try {
    await axiosPayPal.post(
      `/v1/billing/subscriptions/${subscriptionId}/cancel`
    );
    return res.send();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: { message: "Error cancelling the subscription", error },
    });
  }
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
  const { subscriptionId, newPlanId } = req.body;
  try {
    const r = await axiosPayPal.post(
      `/v1/billing/subscriptions/${subscriptionId}/revise`,
      {
        plan_id: newPlanId,
      }
    );
    console.log(r.data.links);

    res.send({ activationLink: r.data.links[0].href });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: { message: "Unable to update" } });
  }
}

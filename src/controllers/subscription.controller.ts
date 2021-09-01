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

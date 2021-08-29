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
  console.log(req);

  //PAYMENT.SALE.COMPLETED= A payment is made on the subscription
  //PAYMENT.SALE.REVERSED = The payment was reversed

  res.sendStatus(200);
}

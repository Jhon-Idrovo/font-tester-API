import { NextFunction, Response, Request } from "express";
import { IWebhookBody } from "../interfaces/webhook_events";
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
  console.log(req.body);
  const { id, event_type, resource } = req.body as IWebhookBody;
  const userId = resource.subscriber.payer_id;
  const user = await User.findById(userId).exec();
  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });
  switch (event_type) {
    //PAYMENT.SALE.COMPLETED= A payment is made on the subscription
    case "PAYMENT.SALE.COMPLETED":
    case "BILLING.SUBSCRIPTION.ACTIVATED":
      const role = await Role.findOne({ name: "User" });
      if (!role)
        return res
          .status(400)
          .json({ error: { message: 'Role "User" not found' } });
      user.role = role._id;
      await user.save();
      break;
    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.SUSPENDED":
    case "PAYMENT.SALE.REVERSED":
      const guestRole = await Role.findOne({ name: "Guest" });
      if (!guestRole)
        return res
          .status(400)
          .json({ error: { message: 'Role "User" not found' } });
      user.role = guestRole._id;
      await user.save();
      break;
    default:
      break;
  }

  res.sendStatus(200);
}

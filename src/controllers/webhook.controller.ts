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

  const users = await User.find({ subscriptionId: resource.id }).exec();
  // handle this security breach.
  if (users.length > 1) return res.send();
  // this doesn't needs to be inside of each case since not all events come here,
  // only the events we handle.
  if (users.length < 1)
    return res.status(400).json({ error: { message: "User not found" } });

  const user = users[0];
  switch (event_type) {
    case "PAYMENT.SALE.COMPLETED": // A payment is made on the subscription
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

import axios from "axios";
import { encodeBase64 } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { PAYPAL_API_URL } from "../config/config";
import { RequestEnhanced } from "../interfaces/utils";

export async function createPayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD", //https://developer.paypal.com/docs/api/reference/currency-codes/
          value: "115.00",
        },
      },
    ],
    //     application_context: {
    //       brand_name: `MiTienda.com`,
    //       landing_page: "NO_PREFERENCE", // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
    //       user_action: "PAY_NOW", // Accion para que en paypal muestre el monto del pago
    //       return_url: `http://localhost:3000/signup`, // Url despues de realizar el pago
    //       cancel_url: `http://localhost:3000`, // Url despues de realizar el pago
    //     },
  };
  try {
    const order = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders`,
      body,
      {
        headers: {
          Authorization: `Basic ${"QVRpRWdPVDZSc1IyZElVekFNNEpnOGJiS292enRjRVNubFlfdTY3dDd1MlRXUUczaEFWZXNfcjRYNjNTNmticWxqaGhOdGxySzF2dFNRelg6RU9oRUdXRW9ROEJsbnA0YUR5MGF2RUd2NjV0WHo0Nmo1aGU2TEVyTkJ1d2llVWxKTzVHSlJKWHMxdmpiMzRWUnFWdlc3ZGJPTC1sR3I1NDM="}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(order.data);

    res.json({ orderId: order.data.id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
}

export async function completePayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const orderId = req.params.orderId;
  try {
    const { data: payment } = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Basic ${"QVRpRWdPVDZSc1IyZElVekFNNEpnOGJiS292enRjRVNubFlfdTY3dDd1MlRXUUczaEFWZXNfcjRYNjNTNmticWxqaGhOdGxySzF2dFNRelg6RU9oRUdXRW9ROEJsbnA0YUR5MGF2RUd2NjV0WHo0Nmo1aGU2TEVyTkJ1d2llVWxKTzVHSlJKWHMxdmpiMzRWUnFWdlc3ZGJPTC1sR3I1NDM="}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(payment);
    res.json({ orderData: payment });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
}

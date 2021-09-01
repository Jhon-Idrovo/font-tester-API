import axios from "axios";
import { PAYPAL_API_URL, PAYPAL_AUTH } from "./config";

const axiosPayPal = axios.create({
  baseURL: PAYPAL_API_URL,
  headers: {
    //https://developer.paypal.com/docs/platforms/get-started/
    Authorization: PAYPAL_AUTH,
    "Content-Type": "application/json",
  },
});

export default axiosPayPal;

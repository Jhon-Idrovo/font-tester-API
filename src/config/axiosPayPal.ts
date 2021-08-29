import axios from "axios";
import { PAYPAL_API_URL } from "./config";

const axiosPayPal = axios.create({
  baseURL: PAYPAL_API_URL,
  headers: {
    //https://developer.paypal.com/docs/platforms/get-started/
    Authorization: `Basic ${"QVRpRWdPVDZSc1IyZElVekFNNEpnOGJiS292enRjRVNubFlfdTY3dDd1MlRXUUczaEFWZXNfcjRYNjNTNmticWxqaGhOdGxySzF2dFNRelg6RU9oRUdXRW9ROEJsbnA0YUR5MGF2RUd2NjV0WHo0Nmo1aGU2TEVyTkJ1d2llVWxKTzVHSlJKWHMxdmpiMzRWUnFWdlc3ZGJPTC1sR3I1NDM="}`,
    "Content-Type": "application/json",
  },
});

export default axiosPayPal;

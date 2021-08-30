import axios from "axios";
import { PAYPAL_API_URL } from "./config";

const axiosPayPal = axios.create({
  baseURL: PAYPAL_API_URL,
  headers: {
    //https://developer.paypal.com/docs/platforms/get-started/
    Authorization: `Basic ${"QVZXLUxUYzFTWWp4cWZheDNpZGdna2dYR3g2TEs5Sl9TaWVOWk1QUFp4aFFacDFUTTNuZnNJcTg5M2p1Um1LVE1MTk5CRGpxX2J4Tzl3SUk6RU1UZjNGMXNTU19JY2hsODdRQ2RNU3hnSERVZmk5U1B2MTQ2Q21raXdGTkp3Snh4emFFa2RyVlRHQVdndjA2VGIxeTV2SHMyTUtDa3Bkdnk="}`,
    "Content-Type": "application/json",
  },
});

export default axiosPayPal;

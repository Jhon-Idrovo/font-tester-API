export const accessTokenLifetime = "1h";
export const refreshTokenLifetime = "72h";
//base URL. Standard form
const version = 3;
export const basePath = `/api/v${version}`;
export const clientDomainPath =
  process.env.NODE_ENV === "production"
    ? "https://font-tester-inky.vercel.app"
    : "http://localhost:8000";
export const PAYPAL_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

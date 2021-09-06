export const accessTokenLifetime = "1h";
export const refreshTokenLifetime = "72h";
//base URL. Standard form
const version = 3;
export const basePath = `/api/v${version}`;
console.log(process.env.NODE_ENV);

export const clientDomainPath =
  process.env.NODE_ENV === "production"
    ? "https://font-tester-inky.vercel.app"
    : "http://localhost:3000";
export const PAYPAL_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
export const PAYPAL_AUTH =
  process.env.NODE_ENV === "production"
    ? `Basic ${"QVZXLUxUYzFTWWp4cWZheDNpZGdna2dYR3g2TEs5Sl9TaWVOWk1QUFp4aFFacDFUTTNuZnNJcTg5M2p1Um1LVE1MTk5CRGpxX2J4Tzl3SUk6RU1UZjNGMXNTU19JY2hsODdRQ2RNU3hnSERVZmk5U1B2MTQ2Q21raXdGTkp3Snh4emFFa2RyVlRHQVdndjA2VGIxeTV2SHMyTUtDa3Bkdnk="}`
    : `Basic ${"QVZXLUxUYzFTWWp4cWZheDNpZGdna2dYR3g2TEs5Sl9TaWVOWk1QUFp4aFFacDFUTTNuZnNJcTg5M2p1Um1LVE1MTk5CRGpxX2J4Tzl3SUk6RU1UZjNGMXNTU19JY2hsODdRQ2RNU3hnSERVZmk5U1B2MTQ2Q21raXdGTkp3Snh4emFFa2RyVlRHQVdndjA2VGIxeTV2SHMyTUtDa3Bkdnk="}`;

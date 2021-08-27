export const accessTokenLifetime = "1h";
export const refreshTokenLifetime = "72h";
//base URL. Standard form
const version = 3;
export const basePath = `/api/v${version}`;
export const clientDomainPath =
  process.env.NODE_ENV === "production"
    ? "https://font-tester-api.herokuapp.com"
    : "http://localhost:8000";

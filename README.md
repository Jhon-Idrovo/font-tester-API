## THIS TEMPLATE COUNTS WITH

# CONFIGURE GOOGLE OAuth

- Read https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid?authuser=1
- use the enviroment variables
GOOGLE_CLIENT_ID = id 
GOOGLE_CLIENT_SECRET = secret


## CHARACTERISTICS
- Users with
  - Roles
  - Authentication through password
  - Authorization through JWT access and refresh tokens
    refresh token is stored on a cookie/localstorage and send only when needed
- Endpoints (base url: api/v3/)
  - auth/
    - signin
    - signup
    - get-new-access-token
    - signout
    - create-admin
      For this we need to pass the CREATE_ADMIN_PASSWORD in the request body

DRAWBACKS
If an access or refresh token is stolen we can't verify that the user sending the request is the same as the owner of the token.

TODO

- Set error messages on auth responses. They should be ready for being displayed on the client directly.

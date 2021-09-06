import Client from "@sendgrid/mail";

Client.setApiKey(process.env.SENDGRID_API_KEY as string);
const SendgridClient = Client;
export default SendgridClient;

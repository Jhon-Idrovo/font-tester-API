import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "font.tester.app@gmail.com",
    pass: process.env.GOOGLE_APP_KEY, //created by google following https://www.youtube.com/watch?v=KjheexBLY4A
  },
});

transporter
  .verify()
  .then(() => console.log("Ready for send emails"))
  .catch((err) =>
    console.log("An error happened while seting up the email service", err)
  );

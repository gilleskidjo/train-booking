import { createTransport } from "nodemailer";
import { apiConfig } from "../config";
import { Logger } from "./logger";

export function sendMail(email, message, subject) {
  // const { message, subject } = data;
  const { host, port, secure, authUser, authUserPassword } =
    apiConfig.mail;

  // console.log("Mail sender");
  const transporter = createTransport({
    host,
    port,
    secure,
    auth: {
      user: authUser,
      pass: authUserPassword,
    },
  });

  const mailContent = {
    from: "gilleskidjo@gmail.com",
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailContent, (err, info) => {
    if (err) {
      Logger.error("Error occured while sending mail to client. " + err.message);
      return;
    }

    Logger.info("Message sent: %s", info.messageId);
  });
}

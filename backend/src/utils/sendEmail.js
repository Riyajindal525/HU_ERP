import sgMail from "@sendgrid/mail";
import env from "../config/env.js";

sgMail.setApiKey(env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  try {
    const msg = {
      to: options.email,
      from: env.SENDGRID_FROM_EMAIL, // Must be verified in SendGrid
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    await sgMail.send(msg);
    console.log("✅ SendGrid Email Sent Successfully to:", options.email);
  } catch (error) {
    console.error("❌ SendGrid Email Error:", error.response?.body || error.message);
    throw error;
  }
};

export default sendEmail;

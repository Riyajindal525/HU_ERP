import sgMail from "@sendgrid/mail";
import env from "../config/env.js"; // adjust path if needed

sgMail.setApiKey(env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  try {
    const msg = {
      to: options.email,
      from: `${env.EMAIL_FROM_NAME || "Haridwar University ERP"} <${env.SENDGRID_FROM_EMAIL}>`,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    await sgMail.send(msg);
    console.log("✅ SendGrid Email Sent Successfully");
  } catch (error) {
    console.error("❌ SendGrid Email Error:", error.response?.body || error.message);
    throw error;
  }
};

export default sendEmail;

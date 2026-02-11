import nodemailer from "nodemailer";

/**
 * Send email using SendGrid SMTP
 * @param {Object} options
 * @param {string} options.email
 * @param {string} options.subject
 * @param {string} options.message
 * @param {string} options.html
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // MUST be false for SendGrid
    auth: {
      user: "apikey", // ⚠️ MUST be literally "apikey"
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const message = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.SENDGRID_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log("SendGrid Email sent:", info.messageId);
};

export default sendEmail;

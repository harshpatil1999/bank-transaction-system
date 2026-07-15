const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error + "!");
  } else {
    console.log("Email server is ready to send messages!");
  }
});

// Function to send email

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bankify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendRegistrationEmail = async (name, email) => {
  const subject = "Welcome to Bankify!";
  const text = `Hello ${name},\n\nThank you for registering at Bankify. We're excited to have you onboard.\n\nBest regards,\nThe Bankify Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering at Bankify. We're excited to have you onboard.</p><p>Best regards,<br>The Bankify Team</p>`;
  await sendEmail(email, subject, text, html);
};

module.exports = { sendRegistrationEmail };

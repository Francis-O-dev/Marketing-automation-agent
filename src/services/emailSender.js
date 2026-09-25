const nodemailer = require("nodemailer");
const config = require("../config/config");
const { log, logSuccess, logError } = require("../utils/logger");

// -- CREATE THE EMAIL CONNECTION --
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.senderAddress,
    pass: config.email.appPassword,
  },
});

// -- SEND EMAIL FUNCTION --
async function sendEmail(leadName, leadEmail, subject, message) {
  try {
    const emailOptions = {
      from: `"${config.email.senderName}" <${config.email.senderAddress}>`,
      to: leadEmail,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(emailOptions);
    logSuccess(`Email sent successfully to ${leadName} at ${leadEmail}`);
    return true;
  } catch (error) {
    logError(`Failed to send email to ${leadName}: ${error.message}`);
    return false;
  }
}

module.exports = { sendEmail };

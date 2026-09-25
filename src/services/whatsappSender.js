const twilio = require("twilio");
const config = require("../config/config");
const { logSuccess, logError, logWarning } = require("../utils/logger");

// -- CREATE TWILIO CONNECTION --
const client = twilio(config.twilio.accountSid, config.twilio.authToken);

// -- SEND WHATSAPP MESSAGE FUNCTION --
async function sendWhatsApp(leadName, leadPhone, message) {
  try {
    await client.messages.create({
      from: config.twilio.fromNumber,
      to: `whatsapp:${leadPhone}`,
      body: message,
    });

    logSuccess(`WhatsApp sent successfully to ${leadName} at ${leadPhone}`);
    return true;
  } catch (error) {
    logError(`Failed to send WhatsApp to ${leadName}: ${error.message}`);
    return false;
  }
}

// -- SHORTEN MESSAGE FOR WHATSAPP --
function shortenForWhatsApp(message) {
  if (message.length <= 300) return message;
  return (
    message.substring(0, 300) +
    "...\n\nReply to this message if you have any questions!"
  );
}

module.exports = { sendWhatsApp, shortenForWhatsApp };

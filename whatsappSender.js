const twilio = require("twilio");
const config = require("./config");

//  CREATE TWILIO CONNECTION 
const client = twilio(
  config.twilio.accountSid,
  config.twilio.authToken
);

// SEND WHATSAPP MESSAGE FUNCTION 
async function sendWhatsApp(leadName, leadPhone, message) {
  try {

    await client.messages.create({
      from: config.twilio.fromNumber,
      to: `whatsapp:${leadPhone}`,
      body: message,
    });

    console.log(`WhatsApp sent successfully to ${leadName} at ${leadPhone}`);
    return true;

  } catch (error) {
    console.log(`Failed to send WhatsApp to ${leadName}: ${error.message}`);
    return false;
  }
}

// WRITE SHORT WHATSAPP VERSION OF MESSAGE 
function shortenForWhatsApp(message) {
  // WhatsApp messages should be shorter than emails
  // We take the first 300 characters and add a friendly ending
  if (message.length <= 300) return message;
  return message.substring(0, 300) + "...\n\nReply to this message if you have any questions!";
}

module.exports = { sendWhatsApp, shortenForWhatsApp };
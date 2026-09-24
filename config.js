require("dotenv").config();

const config = {
  // -- EMAIL SETTINGS --
  email: {
    senderAddress: process.env.GMAIL_ADDRESS,
    senderName: "Bright Smile Dental Clinic",
    appPassword: process.env.GMAIL_APP_PASSWORD,
  },

  // -- CLINIC SETTINGS --
  clinic: {
    name: "Bright Smile Dental Clinic",
    bookingLink: "https://your-booking-link.com",
    phone: process.env.CLINIC_PHONE,
  },

  // -- AI SETTINGS --
  claude: {
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-20b",
  },

  // -- TWILIO WHATSAPP SETTINGS --
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: "whatsapp:+14155238886",
  },

  // -- FOLLOW-UP TIMING SETTINGS (in days) --
  timing: {
    stage1_day: 1,
    stage2_day: 4,
    stage3_day: 8,
    stage4_day: 14,
    stage5_day: 21,
  },

  // -- LEADS FILE --
  leadsFile: "leads.xlsx",
};

module.exports = config;

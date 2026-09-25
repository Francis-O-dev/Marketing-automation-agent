const {
  getLeadsToContact,
  updateLeadAfterContact,
  saveLeads,
} = require("./stageTracker");
const { writeMessage, writeSubject } = require("../services/messageWriter");
const { sendEmail } = require("../services/emailSender");
const {
  sendWhatsApp,
  shortenForWhatsApp,
} = require("../services/whatsappSender");
const {
  log,
  logSuccess,
  logError,
  logWarning,
  logDivider,
} = require("../utils/logger");

// -- PROCESS ONE LEAD --
async function processLead(lead, allLeads) {
  log(
    `Processing lead: ${lead.name} | Stage: ${lead.stage} | Interested in: ${lead.interested_in}`,
  );

  // Step 1 - Ask AI to write personalized subject and message
  log(`Writing personalized message for ${lead.name}...`);
  const subject = await writeSubject(lead);
  const message = await writeMessage(lead);

  // Step 2 - Check if AI wrote the message successfully
  if (!message || !subject) {
    logWarning(`Skipping ${lead.name} - AI failed to write message`);
    return null;
  }

  // Step 3 - Send the email
  log(`Sending email to ${lead.name} at ${lead.email}...`);
  const emailSent = await sendEmail(lead.name, lead.email, subject, message);

  // Step 4 - Send WhatsApp message
  log(`Sending WhatsApp to ${lead.name} at ${lead.phone}...`);
  const whatsappMessage = shortenForWhatsApp(message);
  const whatsAppSent = await sendWhatsApp(
    lead.name,
    lead.phone,
    whatsappMessage,
  );

  // Step 5 - Update lead stage if email was sent successfully
  if (emailSent) {
    const leadIndex = allLeads.findIndex((l) => l.id === lead.id);
    allLeads[leadIndex] = updateLeadAfterContact(lead);
    if (whatsAppSent) {
      logSuccess(`Successfully contacted ${lead.name} via Email and WhatsApp`);
    } else {
      logWarning(`Email sent to ${lead.name} but WhatsApp failed`);
    }
  } else {
    logError(`Failed to send email to ${lead.name} - stage not updated`);
  }

  return { updatedLeads: allLeads, success: emailSent };
}

// -- RUN THE AGENT --
async function runAgent() {
  log(`Marketing Agent Starting...`);
  logDivider();

  // Step 1 - Get all leads and filter who needs contact today
  const { allLeads, leadsToContact } = getLeadsToContact();

  // Step 2 - Check if there is anyone to contact
  if (leadsToContact.length === 0) {
    log(`No leads need contact today. Agent going to sleep.`);
    return;
  }

  log(`Found ${leadsToContact.length} leads to contact today`);
  logDivider();

  // Step 3 - Process each lead one by one
  let updatedLeads = allLeads;
  let successCount = 0;
  let failCount = 0;

  for (const lead of leadsToContact) {
    const result = await processLead(lead, updatedLeads);

    // Safety check - if processLead returned nothing skip this lead
    if (!result) {
      logWarning(`Skipping ${lead.name} - something went wrong`);
      failCount++;
      continue;
    }

    updatedLeads = result.updatedLeads;

    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }

    // Wait 3 seconds between each lead
    if (leadsToContact.indexOf(lead) < leadsToContact.length - 1) {
      log(`Waiting 3 seconds before next lead...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Step 4 - Save all updated leads back to Excel
  logDivider();
  log(`Saving updated leads to Excel...`);
  saveLeads(updatedLeads);

  // Step 5 - Print final summary
  logDivider();
  log(`Agent Run Complete!`);
  logSuccess(`Successfully contacted: ${successCount} leads`);
  if (failCount > 0) {
    logError(`Failed: ${failCount} leads`);
  }
  logDivider();
}

// -- START THE AGENT --
runAgent();

module.exports = { runAgent };

const {
  getLeadsToContact,
  updateLeadAfterContact,
  saveLeads,
} = require("./stageTracker");
const { writeMessage, writeSubject } = require("./messageWriter");
const { sendEmail } = require("./emailSender");
const { sendWhatsApp, shortenForWhatsApp } = require("./whatsappSender");

//  LOG WITH TIMESTAMP
function log(message) {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ${message}`);
}

// PROCESS ONE LEAD
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
    log(`Skipping ${lead.name} - AI failed to write message`);
    return allLeads;
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

  // Step 5 - Update lead stage if at least email was sent successfully
  if (emailSent) {
    const leadIndex = allLeads.findIndex((l) => l.id === lead.id);
    allLeads[leadIndex] = updateLeadAfterContact(lead);
    if (whatsAppSent) {
      log(`Successfully contacted ${lead.name} via Email and WhatsApp`);
    } else {
      log(`Email sent to ${lead.name} but WhatsApp failed`);
    }
  } else {
    log(`Failed to send email to ${lead.name} - stage not updated`);
  }

  return { updatedLeads: allLeads, success: emailSent };
}

// RUN THE AGENT
async function runAgent() {
  log(`Marketing Agent Starting...`);
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Step 1 - Get all leads and filter who needs contact today
  const { allLeads, leadsToContact } = getLeadsToContact();

  // Step 2 - Check if there is anyone to contact
  if (leadsToContact.length === 0) {
    log(`No leads need contact today. Agent going to sleep.`);
    return;
  }

  log(`Found ${leadsToContact.length} leads to contact today`);
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Step 3 - Process each lead one by one
  let updatedLeads = allLeads;
  let successCount = 0;
  let failCount = 0;

  for (const lead of leadsToContact) {
    const result = await processLead(lead, updatedLeads);

    // Safety check - if processLead returned nothing, skip this lead
    if (!result) {
      log(`Skipping ${lead.name} - something went wrong`);
      failCount++;
      continue;
    }

    updatedLeads = result.updatedLeads;

    // Check if this lead was successfully processed
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }

    // Wait 3 seconds between each lead to avoid overwhelming the email server
    if (leadsToContact.indexOf(lead) < leadsToContact.length - 1) {
      log(`Waiting 3 seconds before next lead...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Step 4 - Save all updated leads back to Excel
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  log(`Saving updated leads to Excel...`);
  saveLeads(updatedLeads);

  // Step 5 - Print final summary
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  log(`Agent Run Complete!`);
  log(`Successfully contacted: ${successCount} leads`);
  log(`Failed: ${failCount} leads`);
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

// START THE AGENT
runAgent();

const xlsx = require("xlsx");
const config = require("../config/config");
const { log, logSuccess, logError } = require("../utils/logger");

// -- READ ALL LEADS FROM EXCEL --
function readLeads() {
  try {
    const workbook = xlsx.readFile(config.leadsFile);
    const worksheet = workbook.Sheets["Leads"];
    const leads = xlsx.utils.sheet_to_json(worksheet);
    log(`Read ${leads.length} leads from ${config.leadsFile}`);
    return leads;
  } catch (error) {
    logError(`Failed to read leads file: ${error.message}`);
    return [];
  }
}

// -- SAVE ALL LEADS BACK TO EXCEL --
function saveLeads(leads) {
  try {
    const worksheet = xlsx.utils.json_to_sheet(leads);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Leads");
    xlsx.writeFile(workbook, config.leadsFile);
    logSuccess(`Leads file saved successfully`);
    return true;
  } catch (error) {
    logError(`Failed to save leads file: ${error.message}`);
    return false;
  }
}

// -- CALCULATE DAYS SINCE LAST CONTACT --
function daysSinceContact(lastContactedDate) {
  if (!lastContactedDate) return 999;
  const lastDate = new Date(lastContactedDate);
  const today = new Date();
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// -- DECIDE NEXT STAGE --
function getNextStage(currentStage) {
  const stages = {
    NEW: "INTERESTED",
    INTERESTED: "CONSIDERING",
    CONSIDERING: "READY",
    READY: "FINAL",
    FINAL: "STOPPED",
  };
  return stages[currentStage] || "STOPPED";
}

// -- CHECK IF LEAD NEEDS CONTACT TODAY --
function needsContact(lead) {
  if (lead.unsubscribed === "YES") return false;
  if (lead.stage === "CONVERTED") return false;
  if (lead.stage === "STOPPED") return false;

  const days = daysSinceContact(lead.last_contacted);

  if (lead.stage === "NEW") return days >= config.timing.stage1_day;
  if (lead.stage === "INTERESTED") return days >= config.timing.stage2_day;
  if (lead.stage === "CONSIDERING") return days >= config.timing.stage3_day;
  if (lead.stage === "READY") return days >= config.timing.stage4_day;
  if (lead.stage === "FINAL") return days >= config.timing.stage5_day;

  return false;
}

// -- UPDATE LEAD AFTER CONTACT --
function updateLeadAfterContact(lead) {
  const today = new Date().toISOString().split("T")[0];
  lead.last_contacted = today;
  lead.days_since_contact = 0;
  lead.stage = getNextStage(lead.stage);
  log(`${lead.name} stage updated to: ${lead.stage}`);
  return lead;
}

// -- MARK LEAD AS CONVERTED --
function markAsConverted(lead) {
  lead.stage = "CONVERTED";
  lead.notes = "Customer booked or purchased";
  logSuccess(`${lead.name} marked as CONVERTED`);
  return lead;
}

// -- MARK LEAD AS UNSUBSCRIBED --
function markAsUnsubscribed(lead) {
  lead.unsubscribed = "YES";
  lead.notes = "Lead requested to unsubscribe";
  log(`${lead.name} marked as UNSUBSCRIBED`);
  return lead;
}

// -- GET LEADS THAT NEED CONTACT TODAY --
function getLeadsToContact() {
  const leads = readLeads();
  const leadsToContact = leads.filter((lead) => needsContact(lead));
  log(`${leadsToContact.length} leads need contact today`);
  return { allLeads: leads, leadsToContact };
}

module.exports = {
  readLeads,
  saveLeads,
  needsContact,
  updateLeadAfterContact,
  markAsConverted,
  markAsUnsubscribed,
  getLeadsToContact,
};

// -- LOGGER UTILITY --
// Centralized logging system for the entire agent

function log(message) {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ${message}`);
}

function logSuccess(message) {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ${message}`);
}

function logError(message) {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ${message}`);
}

function logWarning(message) {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ${message}`);
}

function logDivider() {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

module.exports = { log, logSuccess, logError, logWarning, logDivider };

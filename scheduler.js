const schedule = require("node-schedule");
const { runAgent } = require("./src/core/agent");
const { log, logSuccess, logError, logDivider } = require("./src/utils/logger");

// -- SCHEDULE THE AGENT TO RUN EVERY DAY AT 9:00 AM --
log(`Scheduler started - Agent will run every day at 9:00 AM`);
log(`Waiting for next scheduled run...`);
log(`Keep this terminal open to keep the scheduler running`);
logDivider();

schedule.scheduleJob("0 9 * * *", async function () {
  log(`Scheduled run starting...`);
  try {
    await runAgent();
    logSuccess(`Scheduled run completed successfully`);
  } catch (error) {
    logError(`Scheduled run failed: ${error.message}`);
  }
});

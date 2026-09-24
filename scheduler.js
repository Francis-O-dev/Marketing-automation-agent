const schedule = require("node-schedule");
const { execSync } = require("child_process");

// LOG WITH TIMESTAMP
function log(message) {
    const now = new Date().toLocaleString();
    console.log(`[${now}] ${message}`);
}

// RUN THE AGENT
function runAgent() {
    log(`Scheduled run starting...`);
    try {
        execSync("node agent.js", { stdio: "inherit" });
        log(`Scheduled run completed successfully`);
    } catch (error) {
        log(`Scheduled run failed: ${error.message}`);
    }
}

// ── SCHEDULE THE AGENT TO RUN EVERY DAY AT 9:00 AM ──────────
log(`Scheduler started - Agent will run every day at 9:00 AM`);
log(`Waiting for next scheduled run...`);
log(`Keep this terminal open to keep the scheduler running`);
log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

schedule.scheduleJob("0 9 * * *", function () {
    runAgent();
});
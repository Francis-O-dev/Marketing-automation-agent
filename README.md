# AI Marketing Automation Agent

An intelligent marketing automation agent built with Node.js that reads leads from Excel files exported from Facebook and Instagram ads, generates personalized messages using AI, and automatically sends them via Email and WhatsApp until the lead converts or books an appointment.

---

## Branches

| Branch             | Description                                  |
| ------------------ | -------------------------------------------- |
| `main`             | v1 — Flat file structure (beginner friendly) |
| `v2-src-structure` | v2 — Professional src architecture (current) |

---

## Features

- Reads lead data automatically from Excel files (Facebook & Instagram ad exports)
- Uses Groq AI to write personalized messages for each lead
- Sends automated emails via Gmail
- Sends automated WhatsApp messages via Twilio
- Tracks each lead through 5 conversion stages automatically
- Runs on a daily schedule with no manual intervention
- Respects unsubscribe requests immediately
- Stops messaging converted customers automatically
- Logs every action with timestamps using a centralized logger

---

## Conversion Stages

| Stage        | Description                             | Timing |
| ------------ | --------------------------------------- | ------ |
| NEW          | First contact — warm welcome            | Day 1  |
| INTERESTED   | Gentle reminder + benefits              | Day 4  |
| CONSIDERING  | Address fears + free consultation       | Day 8  |
| READY        | Urgency + special offer                 | Day 14 |
| FINAL        | Last attempt + warm goodbye             | Day 21 |
| CONVERTED    | Customer booked/purchased — stop        | —      |
| UNSUBSCRIBED | Requested to stop — never contact again | —      |

---

## Tech Stack

- **Runtime:** Node.js
- **AI:** Groq AI API (openai/gpt-oss-20b model)
- **Email:** Nodemailer + Gmail SMTP
- **WhatsApp:** Twilio WhatsApp API
- **Excel:** xlsx library
- **Scheduler:** node-schedule (cron jobs)
- **Environment:** dotenv

---

## Project Structure

marketing-automation-agent/
├── src/
│ ├── config/
│ │ └── config.js # Central configuration file
│ ├── services/
│ │ ├── emailSender.js # Email sending module
│ │ ├── messageWriter.js # AI message generation
│ │ └── whatsappSender.js # WhatsApp sending module
│ ├── core/
│ │ ├── agent.js # Main agent orchestrator
│ │ └── stageTracker.js # Lead stage tracking and Excel management
│ └── utils/
│ └── logger.js # Centralized logging utility
├── createLeads.js # Creates sample leads Excel file
├── scheduler.js # Daily automatic scheduling
├── leads.xlsx # Leads database (Excel)
├── .env.example # Environment variables template
└── package.json # Project dependencies

---

## Setup & Installation

### 1. Clone the repository

bash
git clone https://github.com/Francis-O-dev/Marketing-automation-agent.git
cd Marketing-automation-agent
git checkout v2-src-structure

### 2. Install dependencies

bash
npm install

### 3. Set up environment variables

bash
cp .env.example .env

Then open `.env` and fill in your real credentials.

### 4. Create sample leads file

bash
node createLeads.js

### 5. Run the agent manually

bash
node src/core/agent.js

### 6. Run on automatic daily schedule

bash
node scheduler.js

---

## Environment Variables

Create a `.env` file with these variables:

GMAIL_ADDRESS=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
GROQ_API_KEY=your-groq-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
CLINIC_PHONE=your-phone-number

---

## How It Works

1. Leads are exported from Facebook/Instagram ad campaigns into Excel
2. The agent reads the Excel file and identifies leads that need contact today
3. For each lead, Groq AI writes a personalized message based on their stage
4. The message is sent via both Email and WhatsApp simultaneously
5. The lead's stage is updated in Excel automatically
6. The process repeats daily on schedule until conversion or unsubscribe

---

## Architecture

This version follows a professional modular architecture:

config/ → All settings in one place
services/ → External integrations (Email, WhatsApp, AI)
core/ → Business logic (Agent, Stage Tracking)
utils/ → Shared utilities (Logger)

Each module has a single responsibility and communicates through clean imports. This makes the codebase easy to maintain, test and scale.

---

## Production Deployment

For production use, replace the Twilio sandbox with a registered WhatsApp Business number:

1. Register your business number at business.whatsapp.com
2. Connect it to Twilio in the console
3. Create Meta-approved message templates for first contact
4. Update `fromNumber` in `src/config/config.js` with your real business number

---

## Author

Francis O.
Full-Stack Developer | AI Automation
[GitHub](https://github.com/Francis-O-dev)

---

## License

MIT License — feel free to use and modify for your own project

const Groq = require("groq-sdk");
const config = require("./config");

// -- CREATE THE GROQ AI CONNECTION --
const client = new Groq({
  apiKey: config.claude.apiKey,
});

// -- EXTRACT TEXT FROM RESPONSE --
function extractText(response) {
  const choice = response.choices[0];
  // Some models put answer in content, others in reasoning
  // We check content first, then fall back to reasoning
  const content = choice.message.content;
  const reasoning = choice.message.reasoning;

  if (content && content.trim() !== "") {
    return content.trim();
  }

  if (reasoning && reasoning.trim() !== "") {
    // Extract the actual message from reasoning
    // The reasoning contains the draft — we find the quoted part
    const draftMatch = reasoning.match(/"([^"]{20,})"/s);
    if (draftMatch) {
      return draftMatch[1].trim();
    }
    // If no quoted part found, return the last paragraph of reasoning
    const paragraphs = reasoning.trim().split("\n\n");
    return paragraphs[paragraphs.length - 1].trim();
  }

  return null;
}

// -- WRITE PERSONALIZED MESSAGE FUNCTION --
async function writeMessage(lead) {
  try {
    const prompt = buildPrompt(lead);

    const response = await client.chat.completions.create({
      model: config.claude.model,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const message = extractText(response);

    if (!message) {
      console.log(`Failed to write message for ${lead.name}: empty response`);
      return null;
    }

    console.log(`Message written for ${lead.name}`);
    return message;
  } catch (error) {
    console.log(`Failed to write message for ${lead.name}: ${error.message}`);
    return null;
  }
}

// -- BUILD PROMPT BASED ON CONVERSION STAGE --
function buildPrompt(lead) {
  const clinicName = config.clinic.name;
  const bookingLink = config.clinic.bookingLink;
  const phone = config.clinic.phone;

  const baseInfo = `
    You are a warm and professional email writer for ${clinicName}.
    Write a personalized email for a lead with these details:
    - Name: ${lead.name}
    - Interested in: ${lead.interested_in}
    - How they found us: ${lead.ad_source} ad
    - Current stage: ${lead.stage}

    Important rules:
    - Write in a warm, friendly and professional tone
    - Never be pushy or aggressive
    - Keep the email under 150 words
    - Always address them by their first name
    - Sign off as "${clinicName} Team"
    - Include this booking link where appropriate: ${bookingLink}
    - Include this phone number where appropriate: ${phone}
    - Return ONLY the email body text, no subject line
    - Do not include any thinking or reasoning in your response
    - Write the final email immediately with no preamble
  `;

  if (lead.stage === "NEW") {
    return (
      baseInfo +
      `
      This is their first contact.
      Welcome them warmly.
      Briefly mention the ${lead.interested_in} service they showed interest in.
      Let them know we are here to help and answer any questions.
      Gently invite them to book a free consultation.
    `
    );
  }

  if (lead.stage === "INTERESTED") {
    return (
      baseInfo +
      `
      We contacted them before but they have not replied yet.
      Remind them gently about their interest in ${lead.interested_in}.
      Share one key benefit of this treatment.
      Reassure them that the process is comfortable and painless.
      Invite them to ask any questions they might have.
    `
    );
  }

  if (lead.stage === "CONSIDERING") {
    return (
      baseInfo +
      `
      They have shown some interest but are still deciding.
      Acknowledge that choosing a dentist is an important decision.
      Address common fears about dental treatments gently.
      Mention that we offer a free no-obligation consultation.
      Make booking feel easy and pressure-free.
    `
    );
  }

  if (lead.stage === "READY") {
    return (
      baseInfo +
      `
      They are close to making a decision.
      Create a gentle sense of urgency mentioning limited appointment slots.
      Offer a special welcome discount for new patients.
      Make the booking process sound extremely simple.
      Provide the booking link and phone number clearly.
    `
    );
  }

  if (lead.stage === "FINAL") {
    return (
      baseInfo +
      `
      This is our last attempt to reach them.
      Be warm and understanding.
      Let them know we respect their time and this will be our last message.
      Leave the door open for them to reach out whenever they are ready.
      Wish them well genuinely.
    `
    );
  }
}

// -- WRITE SUBJECT LINE FUNCTION --
async function writeSubject(lead) {
  try {
    const response = await client.chat.completions.create({
      model: config.claude.model,
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Write a short friendly email subject line for a dental clinic
          email to ${lead.name} who is interested in ${lead.interested_in}.
          They are at the ${lead.stage} stage of considering treatment.
          Return ONLY the subject line text, nothing else, no quotes, no thinking, no reasoning.
          Write the subject line immediately with no preamble.`,
        },
      ],
    });

    const subject = extractText(response);

    if (!subject) {
      const fallback = `Your ${lead.interested_in} Consultation at ${config.clinic.name}`;
      console.log(`Using fallback subject for ${lead.name}`);
      return fallback;
    }

    console.log(`Subject written for ${lead.name}: "${subject}"`);
    return subject;
  } catch (error) {
    console.log(`Failed to write subject for ${lead.name}: ${error.message}`);
    return `Your ${lead.interested_in} Consultation at ${config.clinic.name}`;
  }
}

module.exports = { writeMessage, writeSubject };

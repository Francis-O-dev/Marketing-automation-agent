const xlsx = require("xlsx");

//  CREATE SAMPLE LEADS 
const leads = [
  {

    id: 1,
    name: "Marco Rossi",
    email: "marco.rossi@email.com",
    phone: "+393467961584",
    interested_in: "Teeth Whitening",
    ad_source: "Facebook",
    date_added: "2024-01-01",
    stage: "NEW",
    last_contacted: "",
    days_since_contact: 0,
    unsubscribed: "NO",
    notes: "",

  },

  {

    id: 2,
    name: "Sofia Esposito",
    email: "sofia.esposito@email.com",
    phone: "+393332223333",
    interested_in: "Dental Implants",
    ad_source: "Instagram",
    date_added: "2024-01-01",
    stage: "NEW",
    last_contacted: "",
    days_since_contact: 0,
    unsubscribed: "NO",
    notes: "",
  },

  {

    id: 3,
    name: "Luca Bianchi",
    email: "luca.bianchi@email.com",
    phone: "+393334445555",
    interested_in: "Braces",
    ad_source: "Facebook",
    date_added: "2024-01-01",
    stage: "NEW",
    last_contacted: "",
    days_since_contact: 0,
    unsubscribed: "NO",
    notes: "",
  },

];

// BUILD AND SAVE THE EXCEL FILE 
const worksheet = xlsx.utils.json_to_sheet(leads);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, "Leads");
xlsx.writeFile(workbook, "leads.xlsx");

console.log("leads.xlsx created successfully with " + leads.length + " leads!");
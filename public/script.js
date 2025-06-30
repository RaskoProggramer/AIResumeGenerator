document.getElementById("resumeForm").addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value,
    jobTitle: document.getElementById("jobTitle").value,
    experienceYears: document.getElementById("experienceYears").value,
    skills: document.getElementById("skills").value,
    education: document.getElementById("education").value,
    jobDescription: document.getElementById("jobDescription").value
  };

  const res = await fetch("api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  document.getElementById("summary").value = data.summary;
  checkATSCompatibility(data.summary);
});

function checkATSCompatibility(text) {
  if (typeof text !== "string" || !text.trim()) {
    document.getElementById("atsResult").innerHTML = "<p style='color:red;'>No summary found to analyze.</p>";
    return;
  }

  const keywords = ["skills", "experience", "team", "project", "lead", "results"];
  const found = keywords.filter(k => text.toLowerCase().includes(k));
  const atsScore = Math.floor((found.length / keywords.length) * 100);

  document.getElementById("atsResult").innerHTML = `
    <h3>ATS Compatibility Score: ${atsScore}%</h3>
    <p>Matched Keywords: ${found.join(", ")}</p>
  `;
}

function getTemplate(id, imgBase64 = "") {
  const templates = {
    1: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Template 1</title>
        <style>
          body {
          background: white !important;
          background-image: none !important;
          color: #000;
          font-family: Arial, sans-serif;
          padding: 40px;
          }
          h1, h2 { border-bottom: 1px solid #ccc; }
          .heading { background: #007bff; color: white; padding: 10px; }
        </style>
      </head><body>
      <h1>{{name}}</h1>
      <img src="${imgBase64 || ''}" alt="Profile Picture" />
      <p><strong>Email:</strong> {{email}} | <strong>Phone:</strong> {{contact}}</p>
      <p><strong>Address:</strong> {{address}} | <strong>Citizenship:</strong> {{citizenship}} | <strong>License:</strong> {{license}}</p>
      <div><h2 class="heading">Summary</h2><p>{{summary}}</p></div>
      <div><h2 class="heading">Education</h2><p>{{education}}</p></div>
      <div><h2 class="heading">Experience</h2><p>{{experience}}</p></div>
      <div><h2 class="heading">Skills</h2><p>{{skills}}</p></div>
      </body></html>`,

    2: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Template 2</title>
        <style>
          body {background: white !important;
          background-image: none !important;
          color: #000;
          font-family: Arial, sans-serif;
          padding: 40px;
          }
          h1 { color: #28a745; }
          .heading { background: #28a745; color: white; padding: 8px; }
        </style>
      </head><body>
      <img src="${imgBase64 || ''}" alt="Profile Picture" />
      <h1>{{name}}</h1>
      <p><strong>Email:</strong> {{email}} | <strong>Contact:</strong> {{contact}}</p>
      <p><strong>Address:</strong> {{address}} | <strong>Citizenship:</strong> {{citizenship}} | <strong>License:</strong> {{license}}</p>
      <div class="heading">Summary</div><p>{{summary}}</p>
      <div class="heading">Education</div><p>{{education}}</p>
      <div class="heading">Experience</div><p>{{experience}}</p>
      <div class="heading">Skills</div><p>{{skills}}</p>
      </body></html>`,

    3: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Template 3</title>
        <style>
          body {
          background: white !important;
          background-image: none !important;
          color: #000;
          font-family: Arial, sans-serif;
          padding: 40px;
          }
          .header { background-color: #6f42c1; color: white; padding: 10px; }
          .section { margin-top: 20px; }
          h2 { color: #6f42c1; border-bottom: 1px solid #ddd; }
        </style>
      </head><body>
      <div class="header">
        <img src="${imgBase64 || ''}" alt="Profile Picture" />
        <h1>{{name}}</h1><p>{{jobTitle}}</p>
        <p>{{email}} | {{contact}} | {{address}}</p>
        <p>{{citizenship}} | License: {{license}}</p>
      </div>
      <div class="section" id=""><h2>Professional Summary</h2><p>{{summary}}</p></div>
      <div class="section"><h2>Education</h2><p>{{education}}</p></div>
      <div class="section"><h2>Experience</h2><p>{{experience}}</p></div>
      <div class="section"><h2>Skills</h2><p>{{skills}}</p></div>
      </body></html>`
  };
  return templates[id] || "";
}

async function previewTemplate() {
  const fields = {
    name: document.getElementById("name").value,
    jobTitle: document.getElementById("jobTitle").value,
    email: document.getElementById("email").value,
    contact: document.getElementById("contact").value,
    address: document.getElementById("address").value,
    citizenship: document.getElementById("citizenship").value,
    license: document.getElementById("license").value,
    summary: document.getElementById("summary").value,
    education: document.getElementById("education").value,
    experience: document.getElementById("experienceYears").value,
    skills: document.getElementById("skills").value,
  };

  const imgBase64 = await getBase64FromFile(document.getElementById("profilePic").files[0]);
  let html = getTemplate(document.getElementById("templateSelect").value, imgBase64);

  for (const key in fields) {
    html = html.replaceAll(`{{${key}}}`, fields[key]);
  }

  document.getElementById("resumePreview").srcdoc = html;
}

async function getCVHtmlContent() {
  const fields = {
    name: document.getElementById("name").value,
    jobTitle: document.getElementById("jobTitle").value,
    email: document.getElementById("email").value,
    contact: document.getElementById("contact").value,
    address: document.getElementById("address").value,
    citizenship: document.getElementById("citizenship").value,
    license: document.getElementById("license").value,
    experienceYears: document.getElementById("experienceYears").value,
    education: document.getElementById("education").value,
    skills: document.getElementById("skills").value,
    summary: document.getElementById("summary").value
  };

  const imgBase64 = await getBase64FromFile(document.getElementById("profilePic").files[0]);

  let html = getTemplate(document.getElementById("templateSelect").value, imgBase64);
  for (const key in fields) {
    html = html.replaceAll(`{{${key}}}`, fields[key]);
  }
  return html;
}

function getBase64FromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadSelectedFormat() {
  const format = document.getElementById("formatSelect").value;
  if (format === "pdf") downloadPDF();
  else if (format === "docx") downloadDocx();
  else if (format === "html") downloadHTML();
}

async function downloadPDF() {
  const content = await getCVHtmlContent();
  const element = document.createElement("div");
  element.innerHTML = content;
  html2pdf().from(element).save("smart-resume.pdf");
}

async function downloadDocx() {
  const content = await getCVHtmlContent();
  const blob = new Blob([content], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smart-resume.docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function downloadHTML() {
  const content = await getCVHtmlContent();
  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smart-resume.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

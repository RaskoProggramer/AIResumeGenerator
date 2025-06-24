function getTemplate(id) {
  const templates = {
    1: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Template 1</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1, h2 { border-bottom: 1px solid #ccc; }
          .heading { background: #007bff; color: white; padding: 10px; }
        </style>
      </head><body>
      <h1>{{name}}</h1>
      <p><strong>Email:</strong> {{email}} | <strong>Phone:</strong> {{contact}}</p>
      <p><strong>Address:</strong> {{address}} | <strong>Citizenship:</strong> {{citizenship}} | <strong>License:</strong> {{license}}</p>
      <div><h2 class="heading">Summary</h2><p>{{summary}}</p></div>
      <div><h2 class="heading">Education</h2><p>{{education}}</p></div>
      <div><h2 class="heading">Experience</h2><p>{{experience}}</p></div>
      <div><h2 class="heading">Skills</h2><p>{{skills}}</p></div>
      <div><h2 class="heading">Strengths</h2><p>{{strengths}}</p></div>
      <div><h2 class="heading">Weaknesses</h2><p>{{weaknesses}}</p></div>
      </body></html>`,

    2: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Template 2</title>
        <style>
          body { font-family: Georgia, serif; padding: 40px; background: #f9f9f9; }
          h1 { color: #28a745; }
          .heading { background: #28a745; color: white; padding: 8px; }
        </style>
      </head><body>
      <h1>{{name}}</h1>
      <p><strong>Email:</strong> {{email}} | <strong>Contact:</strong> {{contact}}</p>
      <p><strong>Address:</strong> {{address}} | <strong>Citizenship:</strong> {{citizenship}} | <strong>License:</strong> {{license}}</p>
      <div class="heading">Summary</div><p>{{summary}}</p>
      <div class="heading">Education</div><p>{{education}}</p>
      <div class="heading">Experience</div><p>{{experience}}</p>
      <div class="heading">Skills</div><p>{{skills}}</p>
      <div class="heading">Strengths</div><p>{{strengths}}</p>
      <div class="heading">Weaknesses</div><p>{{weaknesses}}</p>
      </body></html>`,

    3: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Template 3</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; }
          .header { background-color: #6f42c1; color: white; padding: 10px; }
          .section { margin-top: 20px; }
          h2 { color: #6f42c1; border-bottom: 1px solid #ddd; }
        </style>
      </head><body>
      <div class="header">
        <h1>{{name}}</h1><p>{{jobTitle}}</p>
        <p>{{email}} | {{contact}} | {{address}}</p>
        <p>{{citizenship}} | License: {{license}}</p>
      </div>
      <div class="section" id=""><h2>Professional Summary</h2><p>{{summary}}</p></div>
      <div class="section"><h2>Education</h2><p>{{education}}</p></div>
      <div class="section"><h2>Experience</h2><p>{{experience}}</p></div>
      <div class="section"><h2>Skills</h2><p>{{skills}}</p></div>
      <div class="section"><h2>Strengths</h2><p>{{strengths}}</p></div>
      <div class="section"><h2>Weaknesses</h2><p>{{weaknesses}}</p></div>
      </body></html>`
  };

  return templates[id] || "";
}

document.getElementById("resumeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const jobTitle = document.getElementById("jobTitle").value;
  const years = document.getElementById("experienceYears").value;
  const skills = document.getElementById("skills").value;
  const jobDescription = document.getElementById("jobDescription").value;

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobTitle, years, skills, jobDescription })
  });

  const data = await res.json();
  document.getElementById("summary").value = data.summary;

  checkATSCompatibility(data.summary);
});

async function downloadPDF() {
  const resumeHTML = await getCVHtmlContent();
  const element = document.createElement("div");
  element.innerHTML = resumeHTML;
  html2pdf().from(element).save("smart-resume.pdf");
}


async function downloadDocx() {
  const resumeHTML = await getCVHtmlContent();
  const blob = new Blob([resumeHTML], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "smart-resume.docx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadHTML() {
  const resumeHTML = await getCVHtmlContent();
  const blob = new Blob([resumeHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "smart-resume.html";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
    experience: document.getElementById("experience").value,
    skills: document.getElementById("skills").value,
    strengths: document.getElementById("strengths").value,
    weaknesses: document.getElementById("weaknesses").value,
    summary: document.getElementById("summary").value,
  };

  const imgBase64 = await getBase64FromFile(document.getElementById("profilePic").files[0]);

  return `
    <html>
    <head>
      <style>
        body { font-family: Arial; padding: 30px; }
        h1 { color: #333; }
        .section { margin-bottom: 20px; }
        .section h2 { color: #007bff; border-bottom: 1px solid #ccc; }
        .profile { display: flex; align-items: center; gap: 20px; }
        .profile img { width: 100px; height: 100px; object-fit: cover; border-radius: 50%; }
      </style>
    </head>
    <body>
      <div class="profile">
        <img src="${imgBase64 || ''}" alt="Profile Picture" />
        <div>
          <h1>${fields.name}</h1>
          <p><strong>${fields.jobTitle}</strong></p>
          <p>${fields.email} | ${fields.contact} | ${fields.address}</p>
          <p>Citizenship: ${fields.citizenship} | License: ${fields.license}</p>
        </div>
      </div>

      <div class="section"><h2>Professional Summary</h2><p>${fields.summary}</p></div>
      <div class="section"><h2>Education</h2><p>${fields.education}</p></div>
      <div class="section"><h2>Experience</h2><p>${fields.experience}</p></div>
      <div class="section"><h2>Skills</h2><p>${fields.skills}</p></div>
      <div class="section"><h2>Strengths</h2><p>${fields.strengths}</p></div>
      <div class="section"><h2>Weaknesses</h2><p>${fields.weaknesses}</p></div>
    </body>
    </html>
  `;
}

function getBase64FromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Simple ATS check
function checkATSCompatibility(text) {
  const keywords = ["skills", "experience", "team", "project", "lead", "results"];
  const found = keywords.filter(k => text.toLowerCase().includes(k));
  const atsScore = Math.floor((found.length / keywords.length) * 100);

  document.getElementById("atsResult").innerHTML = `
    <h3>ATS Compatibility Score: ${atsScore}%</h3>
    <p>Matched Keywords: ${found.join(", ")}</p>
  `;
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
    experience: document.getElementById("experience").value,
    skills: document.getElementById("skills").value,
    strengths: document.getElementById("strengths").value,
    weaknesses: document.getElementById("weaknesses").value
  };

  const templateId = document.getElementById("templateSelect").value;
  let html = getTemplate(templateId);

  for (const key in fields) {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), fields[key]);
  }

  const iframe = document.getElementById("resumePreview");
  iframe.srcdoc = html;
}


function downloadSelectedFormat() {
  const format = document.getElementById("formatSelect").value;
  if (format === "pdf") downloadPDF();
  else if (format === "docx") downloadDocx();
  else if (format === "html") downloadHTML();
}
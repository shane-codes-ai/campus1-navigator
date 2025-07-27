const toggleBtn = document.getElementById("toggleBtn");
const map2D = document.getElementById("map2d-container");
const map3D = document.getElementById("map3d-container");
const searchInput = document.getElementById("searchInput");
const infoBox = document.getElementById("infoBox");

// 🧭 Camera focus positions for blocks
const blockFocus = {
  "new block": { target: "1m 0m 3m", orbit: "90deg 75deg 4m" },
  "n block": { target: "1m 0m 3m", orbit: "90deg 75deg 4m" },
  "magis block": { target: "5m 0m -2m", orbit: "120deg 75deg 4m" },
  "arrupe block": { target: "-2m 0m 1m", orbit: "180deg 75deg 4m" },
  "pg block": { target: "3m 0m -6m", orbit: "45deg 75deg 4m" },
  "s block": { target: "-4m 0m 2m", orbit: "135deg 75deg 4m" },
  "boys hostel": { target: "-7m 0m -3m", orbit: "90deg 75deg 4m" }
};

// 🏷️ Aliases for blocks
const blockAliases = {
  "new block": "newBlock",
  "n block": "newBlock",
  "magis block": "magisBlock",
  "arrupe block": "arrupeBlock",
  "s block": "sBlock",
  "science block": "sBlock",
  "pg block": "pgBlock",
  "postgraduate block": "pgBlock",
  "boys hostel": "boysHostel"
};

// 🔑 Room and keyword mappings
const keywordMap = {
  "computer": "magisBlock",
  "cs": "magisBlock",
  "n-106": "n106"
};

// ℹ️ Descriptions
const descriptions = {
  newBlock: `🏢 <strong>New Block / N Block</strong><br>
<strong>Full Name:</strong> New Block (commonly called N Block)<br>
<strong>Floors:</strong> G + 3 floors<br>
<strong>Usage:</strong> Classrooms, seminar halls, and admin spaces<br>
<strong>Example Room:</strong> N-106 is on <strong>1st Floor</strong> of New Block.`,

  magisBlock: `🏢 <strong>Magis Block</strong><br>
<strong>Departments:</strong><br>
• <strong>Computer Science</strong> (BCA, BSc CS, MSc CS)<br>
• <strong>Big Data Analytics</strong><br>
<strong>Facilities:</strong> Computer Labs, Smart Classrooms, Staff Rooms`,

  arrupeBlock: `🏢 <strong>Arrupe Block</strong><br>
<strong>Departments:</strong><br>
• <strong>Humanities</strong><br>
• <strong>Psychology</strong><br>
<strong>Usage:</strong> Language Labs, Arts and Humanities Classes`,

  sBlock: `🏢 <strong>S Block (Science Block)</strong><br>
<strong>Departments:</strong> <strong>Physics</strong>, <strong>Chemistry</strong>, <strong>Life Sciences</strong>, <strong>Biotechnology</strong><br>
<strong>Facilities:</strong> Labs, Research Rooms, Lecture Halls`,

  pgBlock: `🏢 <strong>PG Block</strong><br>
<strong>Departments:</strong> <strong>MCom</strong>, <strong>MSc</strong>, <strong>MBA</strong> (some classes)<br>
<strong>Usage:</strong> Reserved for PG courses, Seminar Halls, Faculty Rooms`,

  boysHostel: `🏨 <strong>Boys Hostel</strong><br>
<strong>Facilities:</strong> Mess, Study Rooms, Recreation, Wi-Fi<br>
<strong>Eligibility:</strong> UG & PG Boys, Allotment by Application<br>
<strong>Security:</strong> Gated, ID Access Required`,

  n106: `🏢 <strong>Room N-106</strong><br>📍 Located on <strong>1st Floor</strong> of <strong>New Block</strong>.`
};

// 🔊 Strip emojis and HTML, then speak text
function speakWithoutEmojis(text) {
  const stripped = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF])/g, '')
                       .replace(/<[^>]*>/g, '');
  const utterance = new SpeechSynthesisUtterance(stripped);
  utterance.lang = "en-US";

  const voices = speechSynthesis.getVoices();
  const maleVoice = voices.find(v => v.name.includes("Male") || v.name.includes("David") || v.name.includes("Alex"));
  if (maleVoice) utterance.voice = maleVoice;

  speechSynthesis.speak(utterance);
}

// 🎬 Typewriter text animation
function typeText(htmlText, delay = 20) {
  infoBox.innerHTML = '';
  infoBox.style.opacity = 0;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlText;
  const fullHTML = tempDiv.innerHTML;
  let i = 0;

  const interval = setInterval(() => {
    infoBox.innerHTML = fullHTML.substring(0, i++) + "|";
    if (i > fullHTML.length) {
      clearInterval(interval);
      infoBox.innerHTML = fullHTML;
      speakWithoutEmojis(fullHTML);
    }
  }, delay);

  infoBox.style.opacity = 1;
}

// 🔍 Focus 3D camera to block
function focusOnBlock(blockName) {
  const viewer = document.querySelector("model-viewer");
  const key = blockName.toLowerCase();
  const focus = blockFocus[key];
  if (!focus || !viewer) return;

  viewer.cameraTarget = focus.target;
  viewer.cameraOrbit = focus.orbit;
  viewer.autoRotate = true;
}

// 🎯 Search Input Handling
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const input = searchInput.value.trim().toLowerCase();

    const mappedKeyword = keywordMap[input] || blockAliases[input] || input;
    const description = descriptions[mappedKeyword];

    focusOnBlock(input); // always try focusing even if description not found

    if (description) {
      typeText(description);
    } else {
      typeText(`❌ <strong>No information found for "${input}"</strong><br>Please try a different room number or block name.`);
    }
  }
});

// 🔄 Toggle 2D/3D View
toggleBtn.addEventListener("click", () => {
  const is2DVisible = map2D.classList.contains("visible");

  if (is2DVisible) {
    map2D.classList.replace("visible", "hidden");
    map3D.classList.replace("hidden", "visible");
    toggleBtn.textContent = "Switch to 2D View";
  } else {
    map3D.classList.replace("visible", "hidden");
    map2D.classList.replace("hidden", "visible");
    toggleBtn.textContent = "Switch to 3D View";
  }
});

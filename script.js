const { filterSkillsByCategory, calculateTotalCost, matchSkillsToUser } = require('./skillswap-functions');
const allSkills = [
  { title: "Python Tutoring", category: "Programming", price: 20 },
  { title: "Guitar Lessons",   category: "Music",       price: 15 },
  { title: "Resume Review",    category: "Career",      price: 0  },
  { title: "Web Development",  category: "Programming", price: 25 },
  { title: "Drum Basics",      category: "Music",       price: 18 },
  { title: "LinkedIn Profile", category: "Career",      price: 0  },
];

const skillsContainer = document.getElementById("skills-container");
const filterButtons    = document.querySelectorAll("#filters button");
const calcBtn          = document.getElementById("calc-btn");
const totalEl          = document.getElementById("total-cost");
const matchBtn         = document.getElementById("match-btn");
const matchResults     = document.getElementById("match-results");

function renderSkills(skillsArray) {
  skillsContainer.innerHTML = "";

  if (skillsArray.length === 0) {
    skillsContainer.innerHTML = "<p>No skills match your criteria.</p>";
    return;
  }

  skillsArray.forEach(skill => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${skill.title}</h3>
      <p>Category: ${skill.category}</p>
      <p>Price: $${skill.price} ${skill.price === 0 ? "(Free / Swap)" : "per hour"}</p>
    `;
    card.addEventListener("click", () => {
      alert(`More details for ${skill.title} coming soon!`);
    });

    skillsContainer.appendChild(card);
  });
}
function handleFilterClick(e) {
  filterButtons.forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");

  const category = e.target.dataset.category;
  const filtered = filterSkillsByCategory(allSkills, category);
  renderSkills(filtered);
}
filterButtons.forEach(btn => {
  btn.addEventListener("click", handleFilterClick);
});

document.querySelector('#filters button[data-category="All"]').click();
calcBtn.addEventListener("click", () => {
  const rate  = Number(document.getElementById("rate").value)  || 0;
  const hours = Number(document.getElementById("hours").value) || 0;

  const total = calculateTotalCost(rate, hours);
  totalEl.textContent = total === 0 ? "Free" : `$${total.toFixed(2)}`;
});

matchBtn.addEventListener("click", () => {
  const category = document.getElementById("match-category").value;
  const maxPrice = Number(document.getElementById("max-price").value) || Infinity;

  const userNeeds = { category, maxPrice };
  const matches   = matchSkillsToUser(userNeeds, allSkills);

  matchResults.innerHTML = "";

  if (matches.length === 0) {
    matchResults.innerHTML = "<p>No matches found.</p>";
    return;
  }
  matches.forEach(skill => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${skill.title}</h3>
      <p>${skill.category} • $${skill.price}</p>
    `;
    matchResults.appendChild(card);
  });
});
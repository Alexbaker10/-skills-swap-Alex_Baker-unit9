const { filterSkillsByCategory, calculateTotalCost, matchSkillsToUser } = require('./skillswap-functions');
let allSkills = [];
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
      ${skill.description ? `<p><em>${skill.description}</em></p>` : ''}
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

async function loadAndDisplaySkills() {
    try {
        allSkills = await window.apiService.fetchSkills();
        renderSkills(allSkills);
        filterButtons.forEach(btn => btn.classList.remove("active"));
        document.querySelector('#filters button[data-category="All"]').classList.add("active");

    } catch (error) {
        console.error("Failed to load skills to the UI:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplaySkills();
    const addSkillForm = document.getElementById('add-skill-form');
    if (addSkillForm) {
        addSkillForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newSkillData = {
                title: document.getElementById('skill-title').value,
                category: document.getElementById('skill-category').value,
                price: parseFloat(document.getElementById('skill-price').value),
                description: document.getElementById('skill-description').value
            };

            try {
                await window.apiService.createSkill(newSkillData);
                event.target.reset();
                await loadAndDisplaySkills();
            } catch (error) {
                console.error("Failed to add new skill:", error);
            }
        });
    }
});
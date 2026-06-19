function getCommitteeMembers(){
  return JSON.parse(localStorage.getItem("committeeMembers")) || [];
}

function saveCommitteeMembers(members){
  localStorage.setItem("committeeMembers", JSON.stringify(members));
}

function addCommitteeMember(){
  const name = prompt("Enter committee member name:");
  if(!name) return;

  const role = prompt("Enter role / department:");
  if(!role) return;

  const members = getCommitteeMembers();

  members.push({
    name: name,
    role: role
  });

  saveCommitteeMembers(members);

  loadCommitteeMembers();
  loadCommitteeDropdown();

  alert("Committee member added successfully!");
}

function loadCommitteeMembers(){
  const container = document.querySelector("#view-committee .two-col");

  if(!container) return;

  const addCard = container.lastElementChild;

  container
    .querySelectorAll(".dynamic-member")
    .forEach(card => card.remove());

  const members = getCommitteeMembers();
  const complaints = getComplaints();

  members.forEach(member => {
    const activeCases = complaints.filter(c =>
      c.assignedTo === member.name &&
      c.status !== "Resolved"
    ).length;

    const resolvedCases = complaints.filter(c =>
      c.assignedTo === member.name &&
      c.status === "Resolved"
    ).length;

    const initials = member.name
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase();

    const card = document.createElement("div");

    card.className = "member-card dynamic-member";

    card.innerHTML = `
      <div class="avatar">${initials}</div>

      <div class="member-info">
        <h4>${member.name}</h4>
        <p>${member.role}</p>

        <div class="member-badges">
          <span class="badge badge-progress">
            ${activeCases} active cases
          </span>

          <span class="badge badge-resolved">
            ${resolvedCases} resolved
          </span>
        </div>
      </div>
    `;

    container.insertBefore(card, addCard);
  });
}

function loadCommitteeDropdown(){
  const select = document.getElementById("assignSelect");

  if(!select) return;

  const members = getCommitteeMembers();

  members.forEach(member => {
    const exists = [...select.options].some(
      option => option.value === member.name
    );

    if(!exists){
      const option = document.createElement("option");
      option.value = member.name;
      option.textContent = member.name;
      select.appendChild(option);
    }
  });
}

window.addEventListener("load", function(){
  loadCommitteeMembers();
  loadCommitteeDropdown();
});
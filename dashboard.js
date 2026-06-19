function updateDashboard(){
  const complaints = getComplaints();

  const totalCount = complaints.length;

  const pendingCount = complaints.filter(
    c => c.status !== 'Resolved' && !c.assignedTo
  ).length;

  const progressCount = complaints.filter(
    c =>
      c.status === 'Assigned to Committee' ||
      c.status === 'Open' ||
      c.status === 'Under Review' ||
      c.status === 'In Progress'
  ).length;

  const resolvedCount = complaints.filter(
    c => c.status === 'Resolved'
  ).length;

  document.getElementById('dashTotal').textContent = totalCount;
  document.getElementById('dashPending').textContent = pendingCount;
  document.getElementById('dashProgress').textContent = progressCount;
  document.getElementById('dashResolved').textContent = resolvedCount;

  const badge = document.getElementById('dashboardPendingBadge');
  if(badge){
    badge.textContent = pendingCount;
  }
}

function loadDashboardComplaints(){
  const complaints = getComplaints();

  const body = document.getElementById('dashboardComplaintsBody');

  if(!body) return;

  body.innerHTML = '';

  complaints
    .filter(c => c.status !== 'Resolved' && !c.assignedTo)
    .forEach(c => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td><span class="id-pill">${c.id}</span></td>
        <td style="color:var(--muted)">${c.date || '—'}</td>
        <td>${c.type || 'Complaint'}</td>
        <td><span class="badge badge-open">${c.severity || 'Medium'}</span></td>
        <td><span class="badge ${getStatusBadgeClass(c.status)}">${c.status || 'Submitted'}</span></td>
        <td>
          <button class="action-btn" onclick="viewComplaint('${c.id}')">
            Assign ↗
          </button>
        </td>
      `;

      body.appendChild(row);
    });
}
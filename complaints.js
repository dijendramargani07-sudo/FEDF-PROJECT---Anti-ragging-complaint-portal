function getComplaints(){
  return JSON.parse(localStorage.getItem('complaints')) || [];
}

function saveComplaints(data){
  localStorage.setItem('complaints', JSON.stringify(data));
}

function getStatusBadgeClass(status){
  if(status === 'Resolved') return 'badge-resolved';
  if(status === 'Assigned to Committee' || status === 'Open') return 'badge-open';
  if(status === 'Under Review' || status === 'In Progress') return 'badge-progress';
  return 'badge-new';
}

function getSeverityLabel(){
  if(sev === 'low') return 'Low';
  if(sev === 'high') return 'High';
  return 'Medium';
}

function submitComplaint(){
  const complaints = getComplaints();

  const typeSelect = document.querySelector('#view-submit select:not(#deptSelect)');
  const desc = document.querySelector('#view-submit textarea');

  const complaint = {
    id: 'ARS-' + Date.now(),
    date: new Date().toLocaleDateString(),
    incidentDate: document.getElementById('incidentDate')?.value || '',
    name: document.getElementById('nameInput')?.value || 'Anonymous',
    department: document.getElementById('deptSelect')?.value || 'Not selected',
    type: typeSelect?.value || 'General',
    description: desc?.value || '',
    severity: getSeverityLabel(),
    anonymous: document.getElementById('anonCheck')?.checked ? 'Yes' : 'No',
    assignedTo: '',
    status: 'Submitted',
    timeline: [
      {
        status: 'Submitted',
        date: new Date().toLocaleString()
      }
    ]
  };

  complaints.push(complaint);
  saveComplaints(complaints);

  const confirmId = document.getElementById('confirmId');
  if(confirmId) confirmId.textContent = complaint.id;

  const banner = document.getElementById('submitConfirm');
  if(banner) banner.classList.add('show');

  loadComplaints();
  loadDashboardComplaints();
  updateDashboard();

  if(typeof addNotification === 'function'){
    addNotification(
      `New complaint submitted: ${complaint.id}`,
      `${complaint.type} complaint was submitted and is awaiting assignment.`
    );
    loadNotifications();
  }
}

function loadComplaints(){
  const complaints = getComplaints();
  const table = document.querySelector('#view-complaints tbody');

  if(!table) return;

  table.innerHTML = '';

  complaints.forEach(c => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td><span class="id-pill">${c.id}</span></td>
      <td style="color:var(--muted)">${c.date || '—'}</td>
      <td>${c.type || 'Complaint'}</td>
      <td>${c.department || '—'}</td>
      <td><span class="badge badge-open">${c.severity || 'Medium'}</span></td>
      <td>${c.anonymous === 'Yes'
        ? '<span class="badge badge-anon"><i class="ti ti-user-off"></i> Yes</span>'
        : 'No'}
      </td>
      <td>
  ${
    c.assignedTo
      ? `<span class="badge badge-progress">
            ${c.assignedTo}
         </span>`
      : '<span style="color:var(--hint)">—</span>'
  }
</td>
      <td><span class="badge ${getStatusBadgeClass(c.status)}">${c.status || 'Submitted'}</span></td>
      <td>
        <button class="action-btn" onclick="viewComplaint('${c.id}')">
          View
        </button>
      </td>
    `;

    table.appendChild(row);
  });
}

function viewComplaint(id){
  const c = getComplaints().find(x => x.id === id);

  if(!c){
    alert('Complaint not found');
    return;
  }

  currentComplaintId = id;

  document.getElementById('d-id').textContent = c.id;
  document.getElementById('d-date').textContent = c.date || '—';
  document.getElementById('d-type').textContent = c.type || 'Complaint';

  const sevEl = document.getElementById('d-sev');
  sevEl.textContent = c.severity || 'Medium';
  sevEl.className =
    'badge ' +
    (c.severity === 'High'
      ? 'badge-new'
      : c.severity === 'Low'
      ? 'badge-low'
      : 'badge-open');

  const statusEl = document.getElementById('d-status');
  statusEl.textContent = c.status || 'Submitted';
  statusEl.className = 'badge ' + getStatusBadgeClass(c.status);

  document.getElementById('detailTitle').textContent = 'Case ' + c.id;
  document.getElementById('assignSelect').value = c.assignedTo || '';
  document.getElementById('detailPanel').classList.add('open');
}
let currentComplaintId = null;

function openDetail(id,date,type,severity){
  currentComplaintId = id;
  const saved = getComplaints().find(c => c.id === id);

  document.getElementById('d-id').textContent = id;
  document.getElementById('d-date').textContent = saved?.date || date || '—';
  document.getElementById('d-type').textContent = saved?.type || type || '—';

  const sevEl = document.getElementById('d-sev');
  const sevValue = saved?.severity || severity || '—';
  sevEl.textContent = sevValue;
  sevEl.className = 'badge ' + (sevValue === 'High' ? 'badge-new' : sevValue === 'Medium' ? 'badge-open' : 'badge-low');

  const statusEl = document.getElementById('d-status');
  statusEl.textContent = saved?.status || 'New';
  statusEl.className = 'badge ' + getStatusBadgeClass(saved?.status || 'New');

  document.getElementById('detailTitle').textContent = 'Case ' + id;
  document.getElementById('assignSelect').value = saved?.assignedTo || '';
  document.getElementById('detailPanel').classList.add('open');
}

function closeDetail(){
  document.getElementById('detailPanel').classList.remove('open');
}

function assignCase(){
  const sel = document.getElementById('assignSelect');

  if(!sel.value){
    sel.style.borderColor = '#c0392b';
    return;
  }

  sel.style.borderColor = '';

  const complaints = getComplaints();
  const complaint = complaints.find(c => c.id === currentComplaintId);

  if(complaint){
    complaint.assignedTo = sel.value;
    complaint.status = 'Assigned to Committee';

    if(!complaint.timeline) complaint.timeline = [];

    complaint.timeline.push({
      status: 'Assigned to Committee',
      date: new Date().toLocaleString()
    });

    saveComplaints(complaints);

    addNotification(
      `Case ${complaint.id} assigned`,
      `Assigned to ${sel.value}.`
    );
  }

  document.getElementById('assignedName').textContent = sel.value;
  document.getElementById('assignModal').classList.add('open');

  loadComplaints();
  loadDashboardComplaints();
  updateDashboard();
  loadNotifications();

  if(typeof loadCommitteeMembers === 'function'){
    loadCommitteeMembers();
  }
}

function updateStatus(){
  if(!currentComplaintId){
    alert('Open a complaint first.');
    return;
  }

  const sel = document.getElementById('statusSelect');

  const statusMap = {
    new: 'Submitted',
    open: 'Assigned to Committee',
    'in-progress': 'Under Review',
    resolved: 'Resolved'
  };

  const newStatus = statusMap[sel.value] || 'Submitted';

  const complaints = getComplaints();
  const complaint = complaints.find(c => c.id === currentComplaintId);

  if(!complaint){
    alert('Complaint not found.');
    return;
  }

  complaint.status = newStatus;

  if(!complaint.timeline) complaint.timeline = [];

  complaint.timeline.push({
    status: newStatus,
    date: new Date().toLocaleString()
  });

  saveComplaints(complaints);

  const statusEl = document.getElementById('d-status');
  statusEl.textContent = newStatus;
  statusEl.className = 'badge ' + getStatusBadgeClass(newStatus);

  addNotification(
    `Case ${complaint.id} status updated`,
    `Current status: ${newStatus}.`
  );

  loadComplaints();
  loadDashboardComplaints();
  updateDashboard();
  loadNotifications();

  if(typeof loadCommitteeMembers === 'function'){
    loadCommitteeMembers();
  }
}

function closeModal(){
  document.getElementById('assignModal').classList.remove('open');
  closeDetail();
}
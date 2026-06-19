function showTracking(){
  const id = document.getElementById('trackInput').value.trim();
  const complaint = getComplaints().find(c => c.id === id);
  const result = document.getElementById('trackingResult');

  if(!complaint){
    alert('Complaint not found');
    if(result) result.style.display = 'none';
    return;
  }

  const timeline = complaint.timeline || [
    {
      status: complaint.status || 'Submitted',
      date: complaint.date || ''
    }
  ];

  const flow = [
    'Submitted',
    'Assigned to Committee',
    'Under Review',
    'Resolved'
  ];

  const isResolved = complaint.status === 'Resolved';
  const currentIndex = flow.indexOf(complaint.status);

  const flowHtml = flow.map((step, index) => {

    let cls = '';

    if(isResolved){
      cls = 'done';
    }
    else if(index < currentIndex){
      cls = 'done';
    }
    else if(index === currentIndex){
      cls = 'active';
    }

    const arrow =
      index < flow.length - 1
      ? `<div class="sf-arrow ${cls}"></div>`
      : '';

    return `
      <div class="sf-step ${cls}">
        ${step}
      </div>
      ${arrow}
    `;
  }).join('');

  const timelineHtml = timeline.map((item, index) => {

    const dotClass =
      isResolved
      ? 'done'
      : (index === timeline.length - 1 ? 'active' : 'done');

    const iconClass =
      isResolved
      ? 'ti-check'
      : (index === timeline.length - 1 ? 'ti-clock' : 'ti-check');

    return `
      <div class="track-step">
        ${
          index < timeline.length - 1
          ? '<div class="track-step-line"></div>'
          : ''
        }

        <div class="ts-dot ${dotClass}">
          <i class="ti ${iconClass}"></i>
        </div>

        <div class="ts-body">
          <strong>${item.status}</strong>
          <small>${item.date || ''}</small>
        </div>
      </div>
    `;
  }).join('');

  result.innerHTML = `
    <div class="tracking-card">

      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
        <div>
          <p style="font-size:12px;color:var(--muted)">Case ID</p>
          <p style="font-size:18px;font-weight:700;font-family:'Courier New',monospace">
            ${complaint.id}
          </p>
        </div>

        <span class="badge ${getStatusBadgeClass(complaint.status)}" style="font-size:12px;padding:5px 12px">
          ${complaint.status}
        </span>
      </div>

      <div class="status-flow">
        ${flowHtml}
      </div>

      <div class="track-steps" style="margin-top:1.5rem">
        ${timelineHtml}
      </div>

      <div style="margin-top:1.25rem;padding:12px;background:var(--surface2);border-radius:var(--r);font-size:12px;color:var(--muted);display:flex;gap:8px;align-items:flex-start">
        <i class="ti ti-info-circle" style="font-size:15px;flex-shrink:0;margin-top:1px"></i>
        <span>
          Last updated:
          ${timeline[timeline.length - 1]?.date || 'Not available'}.
          Current status: ${complaint.status}.
        </span>
      </div>

    </div>
  `;

  result.style.display = 'block';

  setTimeout(() => {
    result.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }, 50);
}
function generateMonthlyPDF(){
  if(!window.jspdf){ alert('PDF library loading...'); return; }

  const complaints=getComplaints();
  const resolved=complaints.filter(c=>c.status==='Resolved').length;
  const progress=complaints.filter(c=>['Under Review','Assigned to Committee'].includes(c.status)).length;
  const pending=complaints.filter(c=>!c.assignedTo).length;

  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  doc.setFontSize(18);
  doc.text('SafeCampus Monthly Report',20,20);
  doc.setFontSize(12);
  doc.text('Total Complaints: '+complaints.length,20,40);
  doc.text('Resolved: '+resolved,20,50);
  doc.text('In Progress: '+progress,20,60);
  doc.text('Pending Assignment: '+pending,20,70);
  doc.save('Monthly_Report.pdf');
}

function generateUGCReport(){
  const {jsPDF}=window.jspdf;
  const complaints=getComplaints();
  const doc=new jsPDF();
  doc.setFontSize(18);
  doc.text('UGC Anti-Ragging Compliance Report',20,20);
  doc.setFontSize(12);
  doc.text('Institution Compliance Summary',20,40);
  doc.text('Complaints: '+complaints.length,20,55);
  doc.text('Resolved: '+complaints.filter(c=>c.status==='Resolved').length,20,65);
  doc.save('UGC_Report.pdf');
}

function exportCSV(){
  const complaints=getComplaints();
  const rows=[['Case ID','Date','Type','Department','Severity','Assigned To','Status']];
  complaints.forEach(c=>rows.push([c.id,c.date,c.type,c.department,c.severity,c.assignedTo || '',c.status]));
  const csv=rows.map(r=>r.map(v=>`"${String(v || '').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='Complaints.csv';
  a.click();
}

function generateAnnualReport(){
  const {jsPDF}=window.jspdf;
  const complaints=getComplaints();
  const doc=new jsPDF();
  doc.setFontSize(18);
  doc.text('Annual Analytics Report',20,20);
  doc.setFontSize(12);
  doc.text('Academic Year Summary',20,40);
  doc.text('Total complaints: '+complaints.length,20,55);
  doc.save('Annual_Analytics_Report.pdf');
}

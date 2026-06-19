function getNotifications(){
  return JSON.parse(localStorage.getItem('notifications')) || [];
}

function saveNotifications(data){
  localStorage.setItem('notifications', JSON.stringify(data));
}

function addNotification(title,message){
  const notifications=getNotifications();
  notifications.unshift({title,message,time:new Date().toLocaleString(),unread:true});
  saveNotifications(notifications);
}

function loadNotifications(){
  const list=document.getElementById('notificationsList') || document.querySelector('.notif-list');
  if(!list) return;

  const notifications=getNotifications();
  if(notifications.length===0){
    list.innerHTML=`
      <div class="notif-item">
        <i class="ti ti-bell notif-icon blue"></i>
        <div class="notif-body">
          <strong>No notifications yet</strong>
          <small>New complaint and status updates will appear here.</small>
        </div>
      </div>`;
    return;
  }

  list.innerHTML=notifications.map(n=>`
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <i class="ti ti-alert-circle notif-icon amber"></i>
      <div class="notif-body">
        <strong>${n.title}</strong>
        <small>${n.message}</small>
      </div>
      <span class="notif-time">${n.time}</span>
    </div>`).join('');
}

window.onload=function(){
  loadComplaints();
  loadDashboardComplaints();
  updateDashboard();
  loadNotifications();
};

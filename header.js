async function logoutUser() {
  const token = sessionStorage.getItem('auth_token');
  if (!token) window.location.href = '/PI-Labs/auth/login.html';

  try {
    await fetch(`${BASE_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    window.location.href = '/PI-Labs/auth/login.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

document.addEventListener('DOMContentLoaded', (e) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const token = sessionStorage.getItem('auth_token');

  document.getElementById('header__user').textContent = `${user.first_name} ${user.last_name}`;

  document.getElementById('header__logoutBtn').addEventListener('click', () => {
    logoutUser();
  });

  // Navbar toggle
  document.getElementById('header__sideMenu').addEventListener('click', (e) => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('active');
    e.stopPropagation();
  });

  // Close navbar when clicking outside on small screens (<768px)
  document.addEventListener('click', (e) => {
    const navbar = document.getElementById('navbar');
    const sideMenu = document.getElementById('header__sideMenu');
    if (
      window.innerWidth < 768 &&
      !navbar.contains(e.target) &&
      !sideMenu.contains(e.target)
    ) {
      navbar.classList.remove('active');
    }
  });

  // Notifications bell functionality
  const bell = document.getElementById('header__icon_notifications');
  const signal = document.getElementById('header__notifications_signal');
  // const notificationsPreview = document.querySelector('.header__notifications_preview');

  // async function loadNotifications() {
  //   try {
  //     const response = await fetch(`${BASE_API_URL}/chatrooms`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const chatrooms = await response.json();
  //     notificationsPreview.innerHTML = '';
  //     for (const chatroom of chatrooms) {
  //       const messages = await fetch(`${BASE_API_URL}/chatrooms/${chatroom._id}/messages`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }).then(res => res.json());
  //       const lastMessage = messages[messages.length - 1];
  //       if (lastMessage) {
  //         const notification = document.createElement('div');
  //         notification.className = 'notification_item';
  //         notification.dataset.chatroomId = chatroom._id;
  //         notification.innerHTML = `
  //           <img class="notification_avatar" src="/PI-Labs/assets/avatar.png" alt="Avatar">
  //           <p>${lastMessage.sender.first_name} ${lastMessage.sender.last_name}: ${lastMessage.content.slice(0, 20)}...</p>
  //         `;
  //         notification.addEventListener('click', () => {
  //           window.location.href = `../messages/messages.html?chatroom=${chatroom._id}`;
  //         });
  //         notificationsPreview.appendChild(notification);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error loading notifications:', error);
  //   }
  // }

  bell.addEventListener('click', (e) => {
    signal.style.opacity = '0%';
    window.location.href = '../messages/messages.html';
  });

  bell.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    bell.style.animation = 'jiggle 0.3s 3';
    setTimeout(() => {
      bell.style.animation = '';
      signal.style.opacity = '100%';
    }, 900);
  });

  // socket.on('message', (msg) => {
  //   if (window.location.pathname.includes('messages.html')) {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const currentChatroom = urlParams.get('chatroom');
  //     if (currentChatroom === msg.chatroomId) return; // No animation if in the same chat
  //   }
  //   bell.style.animation = 'jiggle 0.3s 3';
  //   signal.style.opacity = '100%';
  //   setTimeout(() => {
  //     bell.style.animation = '';
  //   }, 900);
  //   loadNotifications();
  // });

  // socket.emit('join', { userId: user.id, token });
  // loadNotifications();
});
let isEdit = false;

document.addEventListener("DOMContentLoaded", () => {
  if (!user || !token) {
    window.location.href = "/PI-Labs/auth/login.html";
    return;
  }
  const chatroomsList = document.getElementById("chatrooms__select_list");
  const chatroomName = document.getElementById("chat__name");
  const chatroomInputMsgContainer = document.getElementById(
    "chat__messageInput_container"
  );
  const chatroomAddMore = document.getElementById("chatrooms__add_new");
  const chatContainer = document.getElementById("chat__messages_container");
  const chatContainerScroll = document.getElementById("chat__container");
  const messageInput = document.getElementById("chat__messageInput");
  const sendButton = document.getElementById("chat__sendButton");
  const createChatButton = document.getElementById(
    "chatrooms__select_newButton"
  );
  const modalHeader = document.getElementById("modal_header");
  const newChatroomModal = document.getElementById("modal-create-chat");
  const newChatroomModalSelect = document.getElementById("participants_select");
  const newChatroomModalName = document.getElementById("chat_name");
  const newChatroomModalSubmit = document.getElementById("create_chat_submit");
  const chatroomsHamburger = document.querySelector(".chatrooms__hamburger");
  const chatroomsSelect = document.querySelector(".chatrooms__select");
  const chatroomMembers = document.getElementById("chatroom_members");

  const chatroomDelete = document.getElementById("chatrooms__delete");

  const urlParams = new URLSearchParams(window.location.search);
  let currentChatroomId = urlParams.get("chatroom");

  chatroomsHamburger.addEventListener("click", () => {
    chatroomsSelect.classList.add("active");
  });

  document.addEventListener("click", (e) => {
    if (
      window.innerWidth < 768 &&
      !chatroomsSelect.contains(e.target) &&
      e.target != chatroomsHamburger
    ) {
      chatroomsSelect.classList.remove("active");
    }
  });

  async function loadChatrooms() {
    try {
      const response = await fetch(`${BASE_API2_URL}/chatrooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) tokenExpired();
      const chatrooms = await response.json();

      chatroomsList.innerHTML = "";
      chatrooms.forEach((chatroom) => {
        const li = document.createElement("li");
        li.className = "chatroom__item";
        li.id = `chatroom_${chatroom._id}`;
        li.dataset.chatroomId = chatroom._id;
        li.innerHTML = chatroom.name;
        if (chatroom.participants.some((p) => p.id === user.id)) {
          li.classList.add("user__chatroom");
        }
        li.addEventListener("click", () => {
          window.location.href = `../messages/messages.html?chatroom=${chatroom._id}`;
        });
        chatroomsList.appendChild(li);
      });
    } catch (error) {
      console.error("Error loading chatrooms:", error);
    }
  }

  async function loadMessages() {
    if (!currentChatroomId) return;
    const response = await fetch(
      `${BASE_API2_URL}/chatrooms/${currentChatroomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 401) tokenExpired();
    const chatroom = await response.json();

    chatroomInputMsgContainer.classList.add("active");
    chatroomAddMore.classList.add("active");
    chatroomDelete.classList.add("active");
    chatroomName.innerHTML = `${chatroom.name}`;
    chatroomMembers.innerHTML = `${chatroom.participants
      .map(
        (p) =>
          `<div class="chatroom_member">
          <img
            class="chatroom__header_icon"
            src="../assets/avatar_placeholder.svg"
            alt="Profile Icon"
          />
          <span><span class="chatroom__status ${
            p.status ? "online" : "offline"
          }"></span> ${p.first_name}</span><span>${p.last_name}</span>
        </div>`
      )
      .join(" ")}`;
    try {
      const response = await fetch(
        `${BASE_API2_URL}/chatrooms/${currentChatroomId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 401) tokenExpired();
      const messages = await response.json();
      chatContainer.innerHTML = "";
      messages.forEach((msg) => {
        const isSender = msg.sender.id == user.id;
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat__msg_container_div ${
          isSender
            ? "chat__senderMsg_container_div"
            : "chat__receiverMsg_container_div"
        }`;
        msgDiv.innerHTML = `<div class="msg_header ${
          isSender ? "msg_header_sender" : "msg_header_receiver"
        }">
          <img
            class="chatroom__header_icon"
            src="../assets/avatar_placeholder.svg"
            alt="Profile Icon"
          />
          <span>${msg.sender.first_name} ${msg.sender.last_name}:</span>
        </div>
        <div class="chat__msg_container ${
          isSender ? "chat__senderMsg_container" : "chat__receiverMsg_container"
        }"><p>${msg.content}</p></div>`;
        chatContainer.appendChild(msgDiv);
      });
      chatContainerScroll.scrollTop = chatContainerScroll.scrollHeight;
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  sendButton.addEventListener("click", async () => {
    const content = messageInput.value.trim();
    if (!content || !currentChatroomId) return;
    try {
      const response = await fetch(
        `${BASE_API2_URL}/chatrooms/${currentChatroomId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );
      if (response.status === 401) tokenExpired();
      messageInput.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  createChatButton.addEventListener("click", async () => {
    isEdit = false;
    newChatroomModalName.value = "";
    modalHeader.innerHTML = "Create new chatroom";
    newChatroomModalSubmit.innerHTML = "Create";
    const students = await fetchStudents();
    newChatroomModal.classList.add("active");
    newChatroomModalSelect.innerHTML = `${students
      .filter((s) => s.id !== user.id)
      .map(
        (s) =>
          `<option value="${s.id}">${s.first_name} ${s.last_name} (${s.email})</option>`
      )
      .join("")}`;
  });

  chatroomAddMore.addEventListener("click", async () => {
    isEdit = true;
    const response = await fetch(
      `${BASE_API2_URL}/chatrooms/${currentChatroomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 401) tokenExpired();
    const chatroom = await response.json();

    modalHeader.innerHTML = "Edit chatroom";
    newChatroomModalSubmit.innerHTML = "Edit";
    const students = await fetchStudents();
    newChatroomModal.classList.add("active");
    newChatroomModalName.value = chatroom.name;
    newChatroomModalSelect.innerHTML = `${students
      .filter((s) => s.id !== user.id)
      .map(
        (s) =>
          `<option ${
            chatroom.participants.find((p) => p.id == s.id) ? "selected" : ""
          } value="${s.id}">${s.first_name} ${s.last_name} (${
            s.email
          })</option>`
      )
      .join("")}`;
  });

  async function fetchStudents() {
    try {
      const response = await fetch(`${BASE_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) tokenExpired();
      return await response.json();
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  }

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      e.target.closest(".modal-container").classList.remove("active");
    });
  });

  document.querySelectorAll(".modal__close").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      e.target.closest(".modal-container").classList.remove("active");
    });
  });

  chatroomDelete.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `${BASE_API2_URL}/chatrooms/${currentChatroomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 401) tokenExpired();
    } catch (error) {
      console.error("Error creating chatroom:", error);
    }
    window.location.href = `../messages/messages.html`;
  });

  newChatroomModalSubmit.addEventListener("click", async () => {
    const participantIds = Array.from(
      newChatroomModalSelect.selectedOptions
    ).map((opt) => opt.value);
    if (!participantIds.length) return;

    const url = isEdit
      ? `${BASE_API2_URL}/chatrooms/${currentChatroomId}/participants`
      : `${BASE_API2_URL}/chatrooms`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantIds: [...participantIds, user.id],
          name: newChatroomModalName.value,
        }),
      });
      if (response.status === 401) tokenExpired();
      newChatroomModal.classList.remove("active");
      loadChatrooms();
    } catch (error) {
      console.error("Error creating chatroom:", error);
    }
  });

  socket.on("message", async (msg) => {
    await loadChatrooms();
    if (msg.chatroomId === currentChatroomId) {
      loadMessages();
    } else {
      const bell = document.getElementById("header__icon_notifications");
      const signal = document.getElementById("header__notifications_signal");
      bell.style.animation = "jiggle 0.3s 3";
      signal.style.opacity = "100%";
      setTimeout(() => {
        bell.style.animation = "";
      }, 900);
    }
  });

  socket.on("chatroom_updated", async () => {
    loadChatrooms();
    loadMessages();
  });

  loadChatrooms();
  loadMessages();
});

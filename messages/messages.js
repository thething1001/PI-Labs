const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("auth_token");
let isEdit = false;

document.addEventListener("DOMContentLoaded", () => {
  if (!user || !token) {
    window.location.href = "/PI-Labs/auth/login.html";
    return;
  }
  socket.emit("join", { userId: user.id, token });

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

  let currentChatroomId = null;

  // Fetch and display chatrooms
  async function loadChatrooms() {
    try {
      const response = await fetch(`${BASE_API2_URL}/chatrooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        li.addEventListener("click", () =>
          loadMessages(chatroom._id, chatroom.name, chatroom.participants)
        );
        chatroomsList.appendChild(li);
      });
    } catch (error) {
      console.error("Error loading chatrooms:", error);
    }
  }

  // Load messages for a chatroom
  async function loadMessages(chatroomId, _chatroomName, participants) {
    chatroomInputMsgContainer.classList.add("active");
    chatroomAddMore.classList.add("active");
    chatroomName.innerHTML = `${_chatroomName} (${participants
      .map((p) => `${p.first_name} ${p.last_name} (${p.status})`)
      .join(", ")})`;
    currentChatroomId = chatroomId;
    try {
      const response = await fetch(
        `${BASE_API2_URL}/chatrooms/${chatroomId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const messages = await response.json();
      chatContainer.innerHTML = "";
      messages.forEach((msg) => {
        const isSender = msg.sender.id == user.id;
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat__msg_container ${
          isSender ? "chat__senderMsg_container" : "chat__receiverMsg_container"
        }`;
        msgDiv.innerHTML = `
          <p>${msg.sender.first_name} ${msg.sender.last_name}: ${msg.content}</p>
        `;
        chatContainer.appendChild(msgDiv);
      });
      chatContainerScroll.scrollTop = chatContainerScroll.scrollHeight;
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  // Send message
  sendButton.addEventListener("click", async () => {
    const content = messageInput.value.trim();
    if (!content || !currentChatroomId) return;
    try {
      await fetch(`${BASE_API2_URL}/chatrooms/${currentChatroomId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      messageInput.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Create new chatroom
  createChatButton.addEventListener("click", async () => {
    isEdit = false;
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
    modalHeader.innerHTML = "Edit chatroom";
    newChatroomModalSubmit.innerHTML = "Edit";
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

  // Fetch students from PHP backend
  async function fetchStudents() {
    try {
      const response = await fetch(`${BASE_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  newChatroomModalSubmit.addEventListener("click", async () => {
    const participantIds = Array.from(
      newChatroomModalSelect.selectedOptions
    ).map((opt) => opt.value);
    if (!participantIds.length) return;

    const url = isEdit
      ? `${BASE_API2_URL}/chatrooms/${currentChatroomId}/participants`
      : `${BASE_API2_URL}/chatrooms`;

    try {
      await fetch(url, {
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
      newChatroomModal.classList.remove("active");
      loadChatrooms();
    } catch (error) {
      console.error("Error creating chatroom:", error);
    }
  });

  // Socket.IO events
  socket.on("message", async (msg) => {
    await loadChatrooms();
    if (msg.chatroomId === currentChatroomId) {
      const chatroomLi = document.getElementById(`chatroom_${msg.chatroomId}`);
      const event = new Event("click");
      chatroomLi.dispatchEvent(event);
    } else {
      // Trigger notification animation if not in the chat
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
    await loadChatrooms();
    if (currentChatroomId) {
      const chatroomLi = document.getElementById(
        `chatroom_${currentChatroomId}`
      );
      const event = new Event("click");
      chatroomLi.dispatchEvent(event);
    }
  });

  // Load initial chatrooms
  loadChatrooms();
});

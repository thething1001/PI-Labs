const socket = io(BASE_API2_URL);

const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("auth_token");
socket.emit("join", { userId: user.id, token });

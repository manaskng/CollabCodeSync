import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;
const rooms = new Map();

//Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  let currentRoom = null;
  let currentUser = null;

  socket.on("join", ({ roomId, userName }) => {
    if (currentRoom) {
      const oldRoom = rooms.get(currentRoom);
      oldRoom?.users.delete(currentUser);
      socket.leave(currentRoom);
      io.to(currentRoom).emit("userJoined", Array.from(oldRoom.users));
    }

    currentRoom = roomId;
    currentUser = userName;

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: new Set(),
        code: "// start code here",
        language: "javascript",
      });
    }

    const room = rooms.get(roomId);
    room.users.add(userName);
    socket.join(roomId);

    socket.emit("codeUpdate", room.code);
    socket.emit("languageChanged", room.language);

    io.to(roomId).emit("userJoined", Array.from(room.users));
  });

  socket.on("codeChange", ({ roomId, code }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.code = code;
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.language = language;
    io.to(roomId).emit("languageChanged", language);
  });

  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("leaveRoom", () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    room?.users.delete(currentUser);
    io.to(currentRoom).emit("userJoined", Array.from(room.users));
    socket.leave(currentRoom);
    currentRoom = null;
    currentUser = null;
  });

  socket.on("disconnect", () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    room?.users.delete(currentUser);
    io.to(currentRoom).emit("userJoined", Array.from(room.users));
    console.log("User disconnected:", socket.id);
  });
});

// Health check endpoint

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Serve static files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  express.static(
    path.join(__dirname, "../frontend/collabcode/dist")
  )
);

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/collabcode/dist/index.html")
  );
});


server.listen(PORT, () =>
  console.log(` Server running on port ${PORT}`)
);

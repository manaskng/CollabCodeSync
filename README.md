# CollabCodeSync

**CollabCodeSync** is a real-time collaborative code editor that allows multiple users to join a shared room and write code together simultaneously. The application is built using a modern full-stack architecture with real-time synchronization powered by WebSockets.

🔗 **Live Deployment**: https://collabcodesync.onrender.com

<img width="918" height="866" alt="Screenshot 2025-12-21 185700" src="https://github.com/user-attachments/assets/9bc76899-a6f4-430f-943a-48da4666b290" />
<img width="1859" height="865" alt="Screenshot 2025-12-21 193212" src="https://github.com/user-attachments/assets/6c22ba57-6ec7-463f-8128-094b17d89150" />
<img width="1791" height="863" alt="Screenshot 2025-12-21 183411" src="https://github.com/user-attachments/assets/72be3584-fef4-458c-b6e8-432babcf4576" />


---

## Table of Contents
- Introduction
- Key Features
- Application Workflow
- Technical Architecture
- WebSocket Event Flow
- Project Structure
- Deployment Details
- Future Enhancements

---

## Introduction

CollabCodeSync is designed to demonstrate real-time collaboration concepts similar to platforms like Google Docs or VS Code Live Share, but focused on code editing.  
The server maintains authoritative state for each room to ensure consistency across all connected clients and to prevent data overwrites when new users join.

The application supports:
- Real-time code synchronization
- Multi-user room management
- Language switching
- Live typing indicators

---

## Key Features

### 1. Real-Time Collaborative Editing
- Multiple users can edit the same code document simultaneously.
- Changes made by one user are instantly reflected for all others in the room.

### 2. Room-Based Collaboration
- Users join a room using a shared Room ID.
- Each room maintains its own independent state (users, code, language).

### 3. Authoritative Server State
- The backend server stores the latest version of the code and language for each room.
- New users receive the current document snapshot upon joining, preventing accidental overwrites.

### 4. Language Selection
- Users can switch between supported programming languages.
- Language changes are synchronized across all clients in the room.

### 5. Typing Indicators
- Displays live typing indicators to improve collaboration awareness.

### 6. Persistent WebSocket Connections
- Uses Socket.IO for low-latency, bidirectional communication.

---

## Application Workflow

### User Journey

1. A user opens the application URL.
2. The frontend establishes a WebSocket connection with the backend.
3. The user enters a Room ID and username on the Join page.
4. On clicking **Join Room**, a `join` WebSocket event is emitted.
5. The server:
   - Creates the room if it does not exist.
   - Adds the user to the room.
   - Sends the current code and language snapshot to the new user.
6. The user is redirected to the editor interface.
7. Any code changes, language updates, or typing events are synchronized in real time across all users in the room.

---

## Technical Architecture

### Frontend
- **React (Vite)** for UI rendering
- **Monaco Editor** for code editing
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication

### Backend
- **Node.js** runtime
- **Express (v5)** for HTTP server
- **Socket.IO** for WebSocket handling
- In-memory data structures for room state management

### Communication Model
- Single-origin deployment (frontend served by backend)
- WebSocket-based event-driven architecture
- Server acts as the single source of truth

---

## WebSocket Event Flow

| Event Name        | Triggered By | Description |
|------------------|-------------|-------------|
| `join`           | Client      | User joins a room |
| `userJoined`     | Server      | Broadcast updated user list |
| `codeChange`     | Client      | User edits code |
| `codeUpdate`     | Server      | Sync code to other users |
| `languageChange` | Client      | User changes language |
| `languageChanged`| Server      | Sync language selection |
| `typing`         | Client      | Notify others user is typing |
| `leaveRoom`      | Client      | User leaves the room |
| `disconnect`     | Server      | Handle unexpected disconnections |

---

## Project Structure
CollabCodeSync/
├── backend/
│ └── index.js # Express + Socket.IO server
├── frontend/
│ └── collabcode/
│ ├── src/
│ │ └── App.jsx # Main React application
│ ├── index.html
│ └── package.json
├── package.json # Root scripts for build/start
└── README.md

---

## Deployment Details

- The application is deployed as a **single full-stack service** on Render.
- The frontend is built using Vite and served as static files by the Express backend.
- Socket.IO runs on the same server, avoiding cross-origin WebSocket issues.
- A `/health` endpoint is exposed and monitored to prevent free-tier cold starts.

**Live URL**: https://collabcodesync.onrender.com

---

## Future Enhancements

Planned improvements for future versions include:

- Persistent storage using a database (MongoDB / PostgreSQL)
- Redis adapter for Socket.IO to enable horizontal scaling
- Cursor position sharing between users
- Conflict resolution using CRDT or Operational Transformation
- Authentication and private rooms
- Code execution and output preview
- File-based collaboration (multiple files per room)

---

## Summary

CollabCodeSync demonstrates a clean implementation of real-time collaboration using modern web technologies.  
It focuses on correctness, synchronization, and architectural clarity, making it suitable as a learning project, portfolio piece, or foundation for further real-time system exploration.

## created By MANAS RAJ


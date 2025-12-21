import { useEffect, useState } from "react";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io(); 

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

 // SOCKET EVENT HANDLERS
  useEffect(() => {
    const handleUsers = (users) => setUsers(users);
    const handleCode = (newCode) => setCode(newCode);
    const handleTyping = (user) => {
      setTyping(`${user.slice(0, 8)}... is typing`);
      setTimeout(() => setTyping(""), 2000);
    };
    const handleLanguage = (lang) => setLanguage(lang);

    socket.on("userJoined", handleUsers);
    socket.on("codeUpdate", handleCode);
    socket.on("userTyping", handleTyping);
    socket.on("languageChanged", handleLanguage);

    return () => {
      socket.off("userJoined", handleUsers);
      socket.off("codeUpdate", handleCode);
      socket.off("userTyping", handleTyping);
      socket.off("languageChanged", handleLanguage);
    };
  }, []);

 // JOIN & LEAVE ROOM, CODE & LANGUAGE CHANGE, COPY ROOM ID
  const joinRoom = () => {
    if (!roomId || !userName) return;
    socket.emit("join", { roomId, userName });
    setJoined(true);
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setUsers([]);
    setCode("// start code here");
    setLanguage("javascript");
  };

  const handleCodeChange = (newCode) => {
    if (!newCode) return;
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    socket.emit("languageChange", { roomId, language: lang });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 1500);
  };

  // JOIN SCREEN (MODERN UI)
  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 w-[360px] shadow-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            CollabCode
          </h1>
          <p className="text-sm text-gray-200 text-center mb-6">
            Real-time collaborative coding
          </p>

          <input
            className="w-full px-4 py-2 mb-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 mb-5 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <button
            onClick={joinRoom}
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  // collab page with sidebar and editor

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-slate-800 text-white p-4 flex flex-col">
        <div className="mb-4 text-center">
          <h2 className="text-sm font-semibold break-all">
            Room: {roomId}
          </h2>

          <button
            onClick={copyRoomId}
            className="mt-2 px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
          >
            Copy ID
          </button>

          {copySuccess && (
            <p className="text-green-400 text-xs mt-1">{copySuccess}</p>
          )}
        </div>

        <h3 className="text-xs font-semibold mb-2">Users</h3>
        <ul className="flex-1 overflow-auto space-y-1 text-xs">
          {users.map((user, i) => (
            <li key={i} className="bg-slate-700 px-2 py-1 rounded">
              {user.slice(0, 8)}...
            </li>
          ))}
        </ul>

        <p className="text-xs text-gray-300 mt-2 h-5">{typing}</p>

        <select
          value={language}
          onChange={handleLanguageChange}
          className="mt-3 p-2 bg-slate-700 rounded text-xs focus:outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <button
          onClick={leaveRoom}
          className="mt-4 bg-red-600 py-2 rounded hover:bg-red-700 transition text-sm"
        >
          Leave Room
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
};

export default App;

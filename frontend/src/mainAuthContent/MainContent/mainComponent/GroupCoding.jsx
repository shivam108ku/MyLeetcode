import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { useAuthStore } from "../../../store/authStore";
import ThreeBackground from "../../../components/ThreeBackground";
import cat from '../mainAssets/cat.gif'

const socket = io(
  import.meta.env.DEV ? "https://myleetcode.onrender.com" : "https://getsmartcode.site",
  {
    withCredentials: true,
    transports: ["websocket"], // ensure faster connection
  }
);

const GroupCoding = () => {
  const { user } = useAuthStore();

  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!joined || !user?.firstName) return;

    socket.emit("join", { roomId, userName: user.firstName });

    const handleUserJoined = (userList) => setUsers(userList);
    const handleCodeUpdate = (incomingCode) => setCode(incomingCode);
    const handleLanguageUpdate = (lang) => setLanguage(lang);
    const handleUserTyping = (name) => {
      if (name !== user.firstName) {
        setTypingUser(name);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
      }
    };

    socket.on("userJoined", handleUserJoined);
    socket.on("codeUpdate", handleCodeUpdate);
    socket.on("languageUpdate", handleLanguageUpdate);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.emit("leaveRoom");
      socket.off("userJoined", handleUserJoined);
      socket.off("codeUpdate", handleCodeUpdate);
      socket.off("languageUpdate", handleLanguageUpdate);
      socket.off("userTyping", handleUserTyping);
    };
  }, [joined, roomId, user?.firstName]);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socket.emit("codeChange", { roomId, code: newValue });
    socket.emit("typing", { roomId, userName: user.firstName });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("languageChange", { roomId, language: newLang });
  };

  const handleJoin = () => {
    if (!roomId.trim()) return alert("Enter Room ID");
    if (!user?.firstName) return alert("Please log in first");
    setJoined(true);
  };

  const handleLeave = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setUsers([]);
    setCode("");
    setTypingUser(null);
  };

  return (
    <div className="min-h-screen  w-full   bg-cover bg-center bg-no-repeat">
      <div className="w-full min-h-screen bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4">
        <ThreeBackground/>
        {!joined ? (
          <div className="max-w-md w-full mx-auto bg-zinc-900 border border-gray-700 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16   rounded-lg flex items-center justify-center mx-auto mb-4">
                 <img
                src={cat} // Replace with actual path or URL
                alt="Join Icon"
                className="h-28 w-28"
              />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Join Coding Room
              </h2>
              <p className="text-gray-400">
                Collaborate with others in real-time
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-3 mb-6 outline-none focus:ring-0 focus:outline-none bg-zinc-900 border border-gray-700 text-white rounded-lg focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleJoin}
              className="w-full bg-zinc-900 border-b border-green-800 hover:bg-zinc-950 text-white 
                 px-4 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-indigo-500/20 flex 
                 items-center justify-center gap-2"
            >
              
              Join Room
            </button>
          </div>
        ) : (
          <div className="max-w-7xl w-full mx-auto bg-gray-950 border border-gray-700 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Room:{" "}
                  <span className="text-indigo-400 break-all font-mono">
                    {roomId}
                  </span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  You:{" "}
                  <span className="text-green-400 font-medium">
                    {user?.firstName}
                  </span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative">
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="appearance-none bg-gray-800 border border-gray-700 text-white pl-4 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={handleLeave}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Leave
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50">
                <Editor
                  height="520px"
                  defaultLanguage={language}
                  language={language}
                  value={code}
                  theme="vs-dark"
                  onChange={handleCodeChange}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    fontFamily: "monospace",
                    scrollBeyondLastLine: false,
                  }}
                />
                {typingUser && (
                  <div className="p-3 text-sm text-gray-300 italic bg-gray-800 border-t border-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    {typingUser} is typing...
                  </div>
                )}
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 h-[520px] overflow-hidden">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Online Users ({users.length})
                </h3>
                <ul className="space-y-3 overflow-y-auto h-[90%] pr-2">
                  {users.length > 0 ? (
                    users.map((u, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 p-2 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                            {u.charAt(0).toUpperCase()}
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                        </div>
                        <span className="font-medium">{u}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic p-2">
                      No users online
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCoding;

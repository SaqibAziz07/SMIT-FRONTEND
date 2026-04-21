import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Search, MessageSquare } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

// User active within the last 5 minutes = online
const isOnline = (lastSeen) => {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 5 * 60 * 1000;
};

// Reusable avatar — shows photo or initials, with optional online dot
const UserAvatar = ({ user, size = "md", showOnline = true }) => {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-10 h-10 text-sm" : "w-10 h-10 text-sm";
  const online = showOnline && isOnline(user?.lastSeen);
  return (
    <div className="relative shrink-0">
      {user?.avatar ? (
        <img src={user.avatar} alt={user.name} className={`${sz} rounded-full object-cover`} />
      ) : (
        <div className={`${sz} rounded-full bg-gradient-to-br from-[#129F8A] to-[#0d7377] flex items-center justify-center font-bold text-white`}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const userFromUrl = searchParams.get("user");

  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const cu = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(cu);
        const currentUserId = cu?._id || cu?.id;

        const [msgRes, userRes] = await Promise.all([
          axios.get(API_ENDPOINTS.MESSAGES, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_ENDPOINTS.USERS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (msgRes.data.success) setAllMessages(msgRes.data.data);

        if (userRes.data.success) {
          const otherUsers = userRes.data.data.filter(
            (u) => u._id !== currentUserId
          );
          setAvailableUsers(otherUsers);

          if (userFromUrl) {
            setSelectedUserId(userFromUrl);
          } else if (otherUsers.length > 0) {
            setSelectedUserId(otherUsers[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Scroll to bottom when conversation changes or new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUserId, allMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        API_ENDPOINTS.MESSAGES,
        { receiverId: selectedUserId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setAllMessages((prev) => [data.data, ...prev]);
        setNewMessage("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  const currentUserId = currentUser?._id || currentUser?.id;

  // Get conversation messages with selected user
  const conversationMessages = allMessages
    .filter((msg) => {
      const senderId = msg.sender?._id || msg.sender;
      const receiverId = msg.receiver?._id || msg.receiver;
      return (
        (senderId === currentUserId && receiverId === selectedUserId) ||
        (senderId === selectedUserId && receiverId === currentUserId)
      );
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Build last-message map per user for sidebar preview
  const lastMessageMap = {};
  allMessages.forEach((msg) => {
    const senderId = msg.sender?._id || msg.sender;
    const receiverId = msg.receiver?._id || msg.receiver;
    const otherId =
      senderId === currentUserId ? receiverId : senderId;
    if (
      !lastMessageMap[otherId] ||
      new Date(msg.createdAt) > new Date(lastMessageMap[otherId].createdAt)
    ) {
      lastMessageMap[otherId] = msg;
    }
  });

  const selectedUser = availableUsers.find((u) => u._id === selectedUserId);
  const filteredUsers = availableUsers.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Group messages by date for dividers
  const groupedMessages = [];
  conversationMessages.forEach((msg, i) => {
    const msgDate = formatDate(msg.createdAt);
    const prevDate =
      i > 0 ? formatDate(conversationMessages[i - 1].createdAt) : null;
    if (msgDate !== prevDate) {
      groupedMessages.push({ type: "divider", label: msgDate });
    }
    groupedMessages.push({ type: "message", data: msg });
  });

  return (
    <div
      className="flex h-[calc(100vh-5rem)] rounded-3xl overflow-hidden border border-gray-200 shadow-xl bg-white"
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* ───────────────── LEFT SIDEBAR ───────────────── */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-100 bg-[#f9f9f7]">
        {/* Sidebar Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={20} className="text-[#0d7377]" />
            <h2 className="text-lg font-bold text-[#1a2e2a]">Messages</h2>
          </div>
          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#0d7377] transition-colors"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-2 p-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1">
                    <div className="h-3.5 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              No users found
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isActive = u._id === selectedUserId;
              const lastMsg = lastMessageMap[u._id];
              const isLastMine =
                lastMsg &&
                (lastMsg.sender?._id || lastMsg.sender) === currentUserId;

              return (
                <button
                  key={u._id}
                  onClick={() => setSelectedUserId(u._id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-200 text-left border-b border-gray-100/60 ${
                    isActive
                      ? "bg-[#e2f1ec] border-l-4 border-l-[#0d7377]"
                      : "hover:bg-white border-l-4 border-l-transparent"
                  }`}
                >
                  <UserAvatar user={u} showOnline={true} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isActive ? "text-[#0d7377]" : "text-[#1a2e2a]"
                        }`}
                      >
                        {u.name}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                          {formatTime(lastMsg.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {lastMsg
                        ? `${isLastMine ? "You: " : ""}${lastMsg.text}`
                        : u.role || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ───────────────── RIGHT CHAT PANE ───────────────── */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-white shadow-sm">
              <UserAvatar user={selectedUser} showOnline={true} />
              <div>
                <h3 className="font-bold text-[#1a2e2a] leading-tight">
                  {selectedUser.name}
                </h3>
                <p className="text-xs text-green-500 font-medium">
                  {selectedUser.role || "Online"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1 bg-[#f5f7f6]">
              {conversationMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#e2f1ec] flex items-center justify-center">
                    <MessageSquare size={28} className="text-[#0d7377]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a2e2a] mb-1">
                      Start a conversation
                    </p>
                    <p className="text-sm text-gray-400">
                      Say hi to {selectedUser.name}!
                    </p>
                  </div>
                </div>
              ) : (
                groupedMessages.map((item, idx) => {
                  if (item.type === "divider") {
                    return (
                      <div
                        key={`divider-${idx}`}
                        className="flex items-center gap-3 my-4"
                      >
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-semibold bg-[#f5f7f6] px-2">
                          {item.label}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    );
                  }

                  const msg = item.data;
                  const senderId = msg.sender?._id || msg.sender;
                  const isMine = senderId === currentUserId;

                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex items-end gap-2 mb-1 ${
                        isMine ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {!isMine && (
                        <UserAvatar user={selectedUser} size="sm" showOnline={false} />
                      )}

                      <div
                        className={`max-w-[65%] flex flex-col ${
                          isMine ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isMine
                              ? "bg-[#0d7377] text-white rounded-br-sm"
                              : "bg-white text-[#1a2e2a] border border-gray-100 rounded-bl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedUser.name}...`}
                  className="flex-1 bg-[#f5f7f6] border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#0d7377] focus:ring-2 focus:ring-[#0d7377]/10 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="w-11 h-11 bg-[#0d7377] hover:bg-[#0d5a66] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all duration-200 hover:shadow-lg active:scale-95 shrink-0"
                >
                  {sendingMessage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={17} />
                  )}
                </button>
              </form>
              <p className="text-[11px] text-gray-400 mt-2 text-center">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          /* No user selected */
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
            <div className="w-20 h-20 rounded-full bg-[#e2f1ec] flex items-center justify-center">
              <MessageSquare size={36} className="text-[#0d7377]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1a2e2a] mb-2">
                Your Messages
              </h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Select a conversation from the left sidebar to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

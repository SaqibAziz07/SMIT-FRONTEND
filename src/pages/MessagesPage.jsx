import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import axios from "axios";

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const userFromUrl = searchParams.get('user');
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [msgRes, userRes] = await Promise.all([
          axios.get("http://localhost:5000/api/messages", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (msgRes.data.success) setMessages(msgRes.data.data);
        if (userRes.data.success) {
          // Show all users (except current user)
          const currentUser = JSON.parse(localStorage.getItem("user"));
          const currentUserId = currentUser?._id || currentUser?.id;
          
          const otherUsers = userRes.data.data.filter(u => u._id !== currentUserId);
          setAvailableUsers(otherUsers);
          
          // If coming from request detail page, set that user
          if (userFromUrl) {
            setReceiverId(userFromUrl);
          } else if (otherUsers.length > 0) {
            setReceiverId(otherUsers[0]._id);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage || !receiverId) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("http://localhost:5000/api/messages", 
        { receiverId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setMessages([data.data, ...messages]);
        setNewMessage("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pt-4">
      
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a2e2a] text-white p-12 rounded-[2.5rem] shadow-sm relative overflow-hidden"
      >
        <div className="relative z-10">
          <span className="text-xs font-bold tracking-widest text-[#14b8a6] uppercase mb-4 block">Interaction / Messaging</span>
          <h1 className="text-[40px] font-extrabold mb-4 leading-[1.1] max-w-2xl">Keep support moving through direct communication.</h1>
          <p className="text-gray-300 font-medium max-w-2xl">Basic messaging gives helpers and requesters a clear follow-up path once a match happens.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Recent Messages */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#f9f9f7] p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <span className="text-xs font-bold tracking-widest text-[#115e59] uppercase mb-4 block">Conversation stream</span>
          <h2 className="text-[32px] font-extrabold text-[#1a2e2a] mb-8">Recent messages</h2>

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="text-gray-400">Loading conversations...</div>
            ) : messages.length > 0 ? (
              messages.map((msg, i) => (
                <div key={i} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 flex justify-between items-start gap-4">
                  <div>
                    <div className="font-bold text-[#1a2e2a] mb-2">{msg.sender?.name} → {msg.receiver?.name}</div>
                    <p className="text-gray-500 text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="shrink-0 bg-[#e2f1ec] text-[#115e59] w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold tracking-tighter text-center leading-tight">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No messages yet.</div>
            )}
          </div>
        </motion.div>

        {/* Start a conversation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#f9f9f7] p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <span className="text-xs font-bold tracking-widest text-[#115e59] uppercase mb-4 block">Send message</span>
          <h2 className="text-[32px] font-extrabold text-[#1a2e2a] mb-8">Start a conversation</h2>
          
          <form onSubmit={handleSendMessage} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
              <select 
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors appearance-none"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
              >
                <option value="">-- Select a person --</option>
                {availableUsers.length > 0 ? (
                  availableUsers.map(u => (
                    <option key={u._id} value={u._id}>{u.name} • {u.role}</option>
                  ))
                ) : (
                  <option disabled>No users available</option>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea 
                rows="4"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors"
                placeholder="Share support details, ask for files, or suggest next steps."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={sendingMessage}
              className="w-full bg-[#14b8a6] hover:bg-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full transition-colors mt-2 text-base flex items-center justify-center gap-2"
            >
              {sendingMessage ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default MessagesPage;

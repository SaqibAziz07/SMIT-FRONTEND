import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Clock, CheckCircle2, AlertTriangle, ArrowLeft, Send } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const RequestDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);

  const handleMessageRequester = () => {
    if (!request.createdBy?._id) return;
    navigate(`/messages?user=${request.createdBy._id}`);
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await axios.get(`${API_ENDPOINTS.REQUESTS}/${id}`);
        if (data.success) {
          setRequest(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleMarkSolved = async () => {
    if (!user) return alert("Please log in first.");
    setSolving(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_ENDPOINTS.REQUESTS}/${id}/solve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setRequest(data.data);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to mark solved.");
    } finally {
      setSolving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-10 h-10 border-4 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin"></div></div>;
  if (!request) return <div className="text-center py-12 text-gray-500">Request not found.</div>;

  // Check if current user is the request creator (support both _id and id)
  const currentUserId = user?._id || user?.id;
  const requestCreatorId = request.createdBy?._id;
  const isCreator = user && currentUserId === requestCreatorId;
  const isOpen = request.status === "Open";

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-6">
      <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a2e2a] font-bold transition-colors w-fit">
        <ArrowLeft size={18} /> Back to feed
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
        
        {/* Status band */}
        {request.status === "Solved" && (
          <div className="absolute top-0 left-0 w-full bg-emerald-50 text-emerald-700 py-2 text-center font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Solved by {request.solvedBy?.name || 'Community'}
          </div>
        )}

        <div className={`mt-${request.status === 'Solved' ? '6' : '0'}`}>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-[#115e59]/10 text-[#115e59] px-3 py-1.5 rounded-md text-sm font-bold">{request.category}</span>
            <span className={`px-3 py-1.5 rounded-md text-sm font-bold ${request.status === 'Solved' ? 'bg-gray-100 text-gray-500' : request.urgency === 'High' || request.urgency === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
              {request.status === 'Solved' ? 'Solved' : `${request.urgency} Urgency`}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a2e2a] mb-6 leading-tight">{request.title}</h1>
          
          <div className="bg-gray-50 p-6 rounded-2xl mb-8">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{request.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {request.tags?.map((tag, j) => (
              <span key={j} className="text-sm font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 border-t border-gray-100 gap-6">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {request.createdBy?.avatar ? (
                  <img src={request.createdBy.avatar} alt={request.createdBy.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0d7377]/10 shadow-md" />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-[#129F8A] to-[#0d7377] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                    {request.createdBy?.name?.charAt(0) || "?"}
                  </div>
                )}
                {request.createdBy?.lastSeen && (Date.now() - new Date(request.createdBy.lastSeen).getTime() < 5 * 60 * 1000) && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <div className="font-bold text-[#1a2e2a] text-lg flex items-center gap-2">
                  {request.createdBy?.name || "Anonymous"}
                  {(Date.now() - new Date(request.createdBy?.lastSeen).getTime() < 5 * 60 * 1000) && (
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 font-medium">Trust Score: {request.createdBy?.trustScore || 0}%</div>
              </div>
            </div>

            <div className="flex gap-4">
              {isOpen && user && !isCreator && (
                <>
                  <button 
                    onClick={handleMessageRequester}
                    className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:border-[#14b8a6] hover:text-[#14b8a6] transition-colors flex items-center gap-2"
                  >
                    <Send size={18} />
                    Message Requester
                  </button>
                  <button onClick={handleMarkSolved} disabled={solving} className="bg-[#1a2e2a] hover:bg-[#115e59] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md disabled:opacity-50">
                    {solving ? "Processing..." : "✓ Mark as Solved"}
                  </button>
                </>
              )}
              {isOpen && isCreator && (
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-medium text-sm">
                  📌 You created this request. Wait for others to solve it!
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestDetailPage;

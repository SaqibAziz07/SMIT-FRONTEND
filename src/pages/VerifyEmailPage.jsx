import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        setStatus("success");
        setMessage(response.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link may have expired.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 text-center"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#14b8a6] animate-spin mb-6" />
            <h2 className="text-2xl font-extrabold text-[#1a2e2a] mb-2">Verifying your email</h2>
            <p className="text-gray-500">Please wait while we confirm your identity...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-[#14b8a6] mb-6" />
            <h2 className="text-2xl font-extrabold text-[#1a2e2a] mb-2">Success!</h2>
            <p className="text-gray-500 mb-8">{message}</p>
            <Link 
              to="/auth" 
              className="bg-[#1a2e2a] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#115e59] transition-all"
            >
              Sign In
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-extrabold text-[#1a2e2a] mb-2">Oops!</h2>
            <p className="text-gray-500 mb-8">{message}</p>
            <Link 
              to="/auth" 
              className="text-[#115e59] font-bold hover:underline"
            >
              Back to Sign Up
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;

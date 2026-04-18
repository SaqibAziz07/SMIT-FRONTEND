import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import { authService } from "./services/authService";

const App = () => {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const result = await authService.getCurrentUser();
        if (result.success) {
          setUser(result.user);
          setPage("dashboard");
        } else {
          authService.logout();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setPage("dashboard");
  };

  const handleSignup = (newUser) => {
    setUser(newUser);
    setPage("dashboard");
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setPage("landing");
  };

  const handleGetStarted = () => {
    setPage("login");
  };

  const handleOpenSignup = () => {
    setPage("signup");
  };

  if (loading) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", background: "#f4f4f0"
      }}>
        <div style={{
          width: 40, height: 40, border: "3px solid #e5e7eb",
          borderTopColor: "#4caf82", borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {page === "landing" && (
        <LandingPage onGetStarted={handleGetStarted} onOpenSignup={handleOpenSignup} />
      )}
      
      {page === "login" && (
        <Login onLogin={handleLogin} onGoSignup={() => setPage("signup")} />
      )}
      
      {page === "signup" && (
        <Signup onSignup={handleSignup} onGoLogin={() => setPage("login")} />
      )}
      
      {page === "dashboard" && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
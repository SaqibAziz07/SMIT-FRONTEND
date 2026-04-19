import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import FeedPage from "./pages/FeedPage";
import CreateRequestPage from "./pages/CreateRequestPage";
import RequestDetailPage from "./pages/RequestDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AICenterPage from "./pages/AICenterPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Navbar from "./components/Navbar";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth from local storage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#FDFDF9] text-[#1a2e2a] font-sans antialiased">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />
            <Route path="/auth" element={!isAuthenticated ? <AuthPage login={login} /> : <Navigate to="/dashboard" />} />
            <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage user={user} login={login} /> : <Navigate to="/auth" />} />
            <Route path="/dashboard" element={isAuthenticated ? <DashboardPage user={user} /> : <Navigate to="/auth" />} />
            <Route path="/explore" element={<FeedPage />} />
            <Route path="/messages" element={isAuthenticated ? <MessagesPage /> : <Navigate to="/auth" />} />
            <Route path="/create-request" element={isAuthenticated ? <CreateRequestPage user={user} /> : <Navigate to="/auth" />} />
            <Route path="/request/:id" element={<RequestDetailPage user={user} />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/ai-center" element={isAuthenticated ? <AICenterPage /> : <Navigate to="/auth" />} />
            <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/auth" />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage user={user} login={login} logout={logout} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
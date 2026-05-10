import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InsforgeProvider, useUser, useInsforge } from '@insforge/react';
import { insforge } from './lib/insforge';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GenerateRoadmap from './pages/GenerateRoadmap';
import RoadmapDetail from './pages/RoadmapDetail';

// A wrapper to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-t-[#00d4ff] border-[#00d4ff]/20 rounded-full animate-spin"></div>
    </div>
  );
  if (!user) {
    // Preserve URL parameters (like OAuth tokens) when redirecting
    const { search, hash } = window.location;
    return <Navigate to={`/login${search}${hash}`} replace />;
  }
  
  return children;
};

// A wrapper to prevent logged-in users from seeing login/signup
const AuthRoute = ({ children }) => {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-t-[#00d4ff] border-[#00d4ff]/20 rounded-full animate-spin"></div>
    </div>
  );
  if (user) {
    // Preserve URL parameters if they exist
    const { search, hash } = window.location;
    return <Navigate to={`/dashboard${search}${hash}`} replace />;
  }
  
  return children;
};

function App() {
  return (
    <InsforgeProvider client={insforge} afterSignInUrl="/dashboard">
      <BrowserRouter>
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00d4ff]/30">
          <Routes>
            {/* Redirect root to login or dashboard */}
            <Route path="/" element={
              <AuthRoute>
                <Navigate to="/login" replace />
              </AuthRoute>
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } />
            <Route path="/signup" element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/roadmap/new" element={
              <ProtectedRoute>
                <GenerateRoadmap />
              </ProtectedRoute>
            } />
            <Route path="/roadmap/:id" element={
              <ProtectedRoute>
                <RoadmapDetail />
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </InsforgeProvider>
  );
}

export default App;

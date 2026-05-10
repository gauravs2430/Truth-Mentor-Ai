import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '@insforge/react';
import { insforge } from '../../lib/insforge';
import { Plus, Compass, LogOut, User, MessageSquare, BookMarked, Map } from 'lucide-react';

export default function Sidebar() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [roadmaps, setRoadmaps] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchSidebarData = async () => {
        try {
          // Fetch Roadmaps
          const { data: roadmapData, error: roadmapError } = await insforge.database
            .from('roadmaps')
            .select('id, title')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (!roadmapError && roadmapData) {
            setRoadmaps(roadmapData);
          }

          // Fetch Chat Sessions
          const { data: sessionData, error: sessionError } = await insforge.database
            .from('chat_sessions')
            .select('id, title')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!sessionError && sessionData) {
            setSessions(sessionData);
          }
        } catch (err) {
          console.error("Failed to fetch sidebar data", err);
        }
      };
      
      fetchSidebarData();
    }
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await insforge.auth.signOut();
    navigate('/login');
  };

  const handleNewChat = async () => {
    let currentUser = user;
    if (!currentUser) {
      const { data } = await insforge.auth.getCurrentUser();
      currentUser = data?.user;
    }

    if (!currentUser) {
      alert("Session not ready. Please refresh the page.");
      return;
    }
    try {
      const { data, error } = await insforge.database
        .from('chat_sessions')
        .insert([{ user_id: currentUser.id, title: 'New Conversation' }])
        .select()
        .single();
      
      if (error) throw error;
      navigate(`/chat/${data.id}`);
    } catch (err) {
      console.error("Failed to create chat session", err);
    }
  };

  return (
    <div className="w-64 bg-[#050505] border-r border-white/10 flex flex-col h-full shrink-0">
      
      {/* Top Section */}
      <div className="p-4 space-y-2">
        <Link 
          to="/dashboard"
          className="flex items-center gap-2 mb-6 px-2 hover:opacity-80 transition-opacity"
        >
          <Compass className="w-6 h-6 text-[#00d4ff]" />
          <span className="font-bold text-lg tracking-tight text-white">TruthMentor</span>
        </Link>
        
        <button
          onClick={() => navigate('/roadmap/new')}
          className="w-full flex items-center gap-2 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 border border-[#00d4ff]/20 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-[#00d4ff]"
        >
          <Plus className="w-4 h-4" />
          New Roadmap
        </button>

        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-white"
        >
          <MessageSquare className="w-4 h-4 text-[#8a2be2]" />
          New Chat
        </button>
      </div>

      {/* Scrollable History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar">
        {/* Roadmaps Section */}
        <div>
          <div className="px-2 py-1 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Career Paths</p>
          </div>
          
          <div className="space-y-1">
            {roadmaps.length === 0 ? (
              <div className="px-2 py-2 text-xs text-gray-500 italic">No roadmaps yet.</div>
            ) : (
              roadmaps.map((rm) => (
                <Link
                  key={rm.id}
                  to={`/roadmap/${rm.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    location.pathname === `/roadmap/${rm.id}` 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Map className="w-4 h-4 shrink-0" />
                  <span className="truncate">{rm.title}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Chat Sessions Section */}
        <div>
          <div className="px-2 py-1 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversations</p>
          </div>
          
          <div className="space-y-1">
            {sessions.length === 0 ? (
              <div className="px-2 py-2 text-xs text-gray-500 italic">No chats yet.</div>
            ) : (
              sessions.map((session) => (
                <Link
                  key={session.id}
                  to={`/chat/${session.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    location.pathname === `/chat/${session.id}` 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* User Profile Section (Bottom) */}
      <div className="p-4 border-t border-white/10 bg-[#050505]">
        <div className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#8a2be2] flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">
              {user?.profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </div>
  );
}


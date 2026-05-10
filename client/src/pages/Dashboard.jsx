import React from 'react';
import { useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';
import { LogOut, User, Compass, MessageSquare, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await insforge.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#00d4ff]" />
              <span className="font-bold text-xl tracking-tight">TruthMentor</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.profile?.full_name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back.</h1>
          <p className="text-gray-400">Ready to face the reality of your career?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: New Roadmap */}
          <div className="col-span-1 md:col-span-2 group relative bg-gradient-to-br from-[#00d4ff]/10 to-transparent border border-[#00d4ff]/20 rounded-2xl p-8 hover:border-[#00d4ff]/50 transition-all cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d4ff] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative z-10">
              <Compass className="w-10 h-10 text-[#00d4ff] mb-4" />
              <h2 className="text-2xl font-bold mb-2">Generate New Roadmap</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Tell the AI where you are and where you want to go. Get a brutally honest, step-by-step path to get there.
              </p>
              <button className="bg-[#00d4ff] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[#0099cc] transition-colors">
                Start Planning
              </button>
            </div>
          </div>

          {/* Card 2: AI Mentor */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors cursor-pointer flex flex-col justify-between">
            <div>
              <MessageSquare className="w-8 h-8 text-[#8a2be2] mb-4" />
              <h3 className="text-xl font-bold mb-2">Talk to Mentor</h3>
              <p className="text-sm text-gray-400">
                Stuck on a problem? Need resume advice? Chat directly with the AI mentor.
              </p>
            </div>
            <button className="w-full mt-6 py-2 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
              Open Chat
            </button>
          </div>

          {/* Card 3: Saved Resources */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors cursor-pointer flex flex-col justify-between">
            <div>
              <BookMarked className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Bookmarks</h3>
              <p className="text-sm text-gray-400">
                Access your saved tutorials, courses, and articles.
              </p>
            </div>
            <button className="w-full mt-6 py-2 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
              View Resources
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

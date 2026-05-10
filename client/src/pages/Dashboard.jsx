import { useNavigate } from 'react-router-dom';
import { Compass, MessageSquare, BookMarked, Sparkles } from 'lucide-react';
import { useUser } from '@insforge/react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null; // Let the layout or ProtectedRoute handle initial load

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d4ff] rounded-full blur-[200px] opacity-[0.03] pointer-events-none"></div>
      
      <div className="max-w-4xl w-full flex flex-col items-center text-center z-10 mt-12 mb-16">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-[#00d4ff]" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Welcome to TruthMentor, {user?.profile?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Stop getting sugarcoated advice. Get a brutally honest, data-driven roadmap to your dream career. What would you like to do today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full z-10">
        
        {/* Generate Roadmap Card */}
        <div 
          onClick={() => navigate('/roadmap/new')}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#00d4ff]/40 transition-all cursor-pointer group flex flex-col items-center text-center h-full"
        >
          <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Compass className="w-6 h-6 text-[#00d4ff]" />
          </div>
          <h3 className="text-lg font-bold mb-2">Create New Roadmap</h3>
          <p className="text-sm text-gray-400 mb-6 flex-1">
            Tell the AI where you are and where you want to go. Get a step-by-step path to get there.
          </p>
          <span className="text-sm font-bold text-[#00d4ff] group-hover:underline">Start Planning →</span>
        </div>

        {/* AI Mentor Card (Upcoming) */}
        <div 
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#8a2be2]/40 transition-all cursor-pointer group flex flex-col items-center text-center h-full relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-[#8a2be2] text-[10px] font-bold uppercase rounded-md border border-[#8a2be2]/30">Coming Soon</div>
          <div className="w-12 h-12 bg-[#8a2be2]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6 text-[#8a2be2]" />
          </div>
          <h3 className="text-lg font-bold mb-2">Talk to AI Mentor</h3>
          <p className="text-sm text-gray-400 mb-6 flex-1">
            Stuck on a problem? Need resume advice? Have a brutally honest conversation with the mentor.
          </p>
          <span className="text-sm font-bold text-gray-500">Available in Phase 3</span>
        </div>

        {/* Bookmarks Card */}
        <div 
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-yellow-500/40 transition-all cursor-pointer group flex flex-col items-center text-center h-full"
        >
          <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookMarked className="w-6 h-6 text-yellow-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">Saved Resources</h3>
          <p className="text-sm text-gray-400 mb-6 flex-1">
            Access your bookmarked tutorials, courses, and articles from your generated roadmaps.
          </p>
          <span className="text-sm font-bold text-gray-500">Upcoming Feature</span>
        </div>

      </div>
    </div>
  );
}

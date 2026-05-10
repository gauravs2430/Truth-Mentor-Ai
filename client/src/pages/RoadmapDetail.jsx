import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { Compass, ArrowLeft, Loader2, CheckCircle2, Circle, ExternalLink, Calendar, Map } from 'lucide-react';

export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const { data, error } = await insforge.database
        .from('roadmaps')
        .select(`
          *,
          roadmap_steps (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Sort steps by order_index
      if (data && data.roadmap_steps) {
        data.roadmap_steps.sort((a, b) => a.order_index - b.order_index);
      }
      
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoadmap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleStepCompletion = async (stepId, currentStatus) => {
    try {
      // Optimistic update
      setRoadmap(prev => ({
        ...prev,
        roadmap_steps: prev.roadmap_steps.map(step => 
          step.id === stepId ? { ...step, is_completed: !currentStatus } : step
        )
      }));

      const { error } = await insforge.database
        .from('roadmap_steps')
        .update({ is_completed: !currentStatus })
        .eq('id', stepId);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to update step", err);
      // Revert on error
      fetchRoadmap();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#00d4ff] mb-4" />
        <p className="text-gray-400">Loading your path...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-red-400 mb-6">{error || 'Roadmap not found.'}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const completedSteps = roadmap.roadmap_steps.filter(s => s.is_completed).length;
  const totalSteps = roadmap.roadmap_steps.length;
  const progress = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#00d4ff] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#00d4ff]/10 rounded-2xl border border-[#00d4ff]/20">
                  <Map className="w-8 h-8 text-[#00d4ff]" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">{roadmap.title}</h1>
                  <p className="text-[#00d4ff] font-medium flex items-center gap-2 mt-1">
                    <Compass className="w-4 h-4" /> Target: {roadmap.target_role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Created {new Date(roadmap.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex flex-col items-center justify-center p-4 bg-black/30 rounded-2xl border border-white/5 min-w-[150px]">
              <div className="text-4xl font-black text-[#00d4ff] mb-1">{progress}%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Completed</div>
              <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#00d4ff] to-[#0099cc] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#00d4ff]/50 before:via-white/10 before:to-transparent">
          {roadmap.roadmap_steps.map((step, index) => {
            const isCompleted = step.is_completed;
            
            return (
              <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon Marker */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0a0a0a] bg-[#111] absolute left-0 md:left-1/2 -translate-x-1/2 z-10 shrink-0">
                  <button 
                    onClick={() => toggleStepCompletion(step.id, isCompleted)}
                    className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-7 h-7 text-[#00d4ff]" />
                    ) : (
                      <Circle className="w-7 h-7 text-gray-500 hover:text-white" />
                    )}
                  </button>
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 ml-auto md:ml-0 group-hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold px-2 py-1 bg-black/50 text-[#00d4ff] rounded-md border border-[#00d4ff]/20">
                      Phase {index + 1}
                    </span>
                    <h3 className={`text-xl font-bold ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {step.title}
                    </h3>
                  </div>
                  
                  {step.resources && step.resources.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-400 font-medium mb-2">Recommended Resources:</p>
                      {step.resources.map((res, i) => (
                        <a 
                          key={i} 
                          href={res.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#00d4ff]/30 hover:bg-[#00d4ff]/5 transition-colors text-sm group/link"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover/link:text-[#00d4ff]" />
                          <span className="text-gray-300 group-hover/link:text-white truncate">{res.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { useUser } from '@insforge/react';
import { Compass, Briefcase, Target, Zap, Loader2, Code2, Clock } from 'lucide-react';

export default function GenerateRoadmap() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    current_position: '',
    target_role: '',
    experience: '',
    skills: ''
  });

  // Load existing profile data if available
  useEffect(() => {
    if (user?.profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        current_position: user.profile.current_position || '',
        target_role: user.profile.target_role || '',
        experience: user.profile.experience || '',
        skills: '' // We could fetch from user_skills but let's keep it simple text for now
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus('Analyzing your current profile...');

    const { data, error: userError } = await insforge.auth.getCurrentUser();

    if (userError || !data?.user) {
      setError("Session expired. Please login again.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const currentUser = data.user;

    if (!currentUser) {
      setError("User session lost. Please refresh or login again.");
      setLoading(false);
      return;
    }

    try {
      // 1. Update Profile (Optional but good for memory)
      await insforge.database.from('profiles').update({
        current_position: formData.current_position,
        target_role: formData.target_role,
        experience: formData.experience
      }).eq('id', currentUser.id);

      setStatus('Consulting the brutal truth AI mentor...');

      // 2. Build the System Prompt
      const systemPrompt = `You are TruthMentor, a brutally honest, senior-level engineering manager. 
Your goal is to provide realistic, no-nonsense career roadmaps. Do NOT sugarcoat anything. 
If their timeline is unrealistic, tell them. Provide exact, technical steps they need to take.

You MUST respond ONLY with a valid JSON object matching this exact schema:
{
  "title": "A short, brutal title for the roadmap",
  "target_role": "The role they want",
  "steps": [
    {
      "title": "Name of the milestone/skill to learn",
      "resources": [
        { "title": "Resource Name", "url": "https://example.com" }
      ]
    }
  ]
}`;

      const userMessage = `I am currently a ${formData.current_position} with ${formData.experience} of experience.
My current skills are: ${formData.skills}.
I want to become a ${formData.target_role}.
Generate a step-by-step roadmap for me.`;

      // 3. Call InsForge AI Gateway
      const completion = await insforge.ai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      });

      setStatus('Parsing your customized plan...');

      // 4. Parse the AI Response
      let responseText = completion.choices[0].message.content;
      // Cleanup markdown code blocks if the AI returns them
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

      let roadmapData;
      try {
        roadmapData = JSON.parse(responseText);
      } catch (err) {
        throw new Error("The AI failed to generate a valid plan. Please try again.", { cause: err });
      }

      setStatus('Saving to database...');

      // 5. Save Roadmap to DB
      const { data: roadmapInsert, error: roadmapError } = await insforge.database
        .from('roadmaps')
        .insert([{
          user_id: currentUser.id,
          title: roadmapData.title,
          target_role: roadmapData.target_role,
          query: userMessage, // Added missing required field
          is_public: false
        }])
        .select()
        .single();

      if (roadmapError) throw roadmapError;

      // 6. Save Steps to DB
      const stepsToInsert = roadmapData.steps.map((step, index) => ({
        roadmap_id: roadmapInsert.id,
        title: step.title,
        order_index: index + 1,
        resources: step.resources || []
      }));

      const { error: stepsError } = await insforge.database
        .from('roadmap_steps')
        .insert(stepsToInsert);

      if (stepsError) throw stepsError;

      setStatus('Done!');
      navigate(`/roadmap/${roadmapInsert.id}`);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
      </div>
    );
  }

  return (
    <div className="min-h-full text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#00d4ff] rounded-full blur-[150px] opacity-10"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-10 text-center">
          <Compass className="w-12 h-12 text-[#00d4ff] mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Create Your Roadmap</h1>
          <p className="text-gray-400 text-lg">Tell us where you are. We'll tell you the brutal truth of how to get where you want to be.</p>
        </div>

        <form onSubmit={handleGenerate} className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 backdrop-blur-sm">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" /> Current Position
              </label>
              <input
                type="text"
                name="current_position"
                required
                value={formData.current_position}
                onChange={handleChange}
                placeholder="e.g. Junior QA Tester"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00d4ff]/50 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" /> Target Role
              </label>
              <input
                type="text"
                name="target_role"
                required
                value={formData.target_role}
                onChange={handleChange}
                placeholder="e.g. Senior DevOps Engineer"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00d4ff]/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" /> Years of Experience
            </label>
            <input
              type="text"
              name="experience"
              required
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 1 year, or just graduated"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00d4ff]/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-gray-500" /> Current Skills (Comma Separated)
            </label>
            <textarea
              name="skills"
              required
              value={formData.skills}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. HTML, basic CSS, Python, Git"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00d4ff]/50 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex flex-col items-center justify-center gap-1 py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-black bg-gradient-to-r from-[#00d4ff] to-[#0099cc] hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </div>
                <span className="text-xs text-black/70 font-normal">{status}</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" /> Let's Get Real
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

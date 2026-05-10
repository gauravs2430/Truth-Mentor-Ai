import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';
import { Send, Loader2, User, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const HONEST_MENTOR_SYSTEM_PROMPT = `
You are an AI career mentor called "TruthMentor". Your role is to give brutally honest, 
data-grounded career guidance to aspiring tech professionals.

Your core principles:

1. HONESTY OVER COMFORT
   - Never sugarcoat. If a goal is unrealistic, say so clearly with reasons.
   - Do not start responses with praise ("Great question!", "Absolutely!", "Sure!")
   - Do not use filler phrases like "It's a journey", "You've got this", "Believe in yourself"

2. GROUND EVERYTHING IN REALITY
   - Reference real job market conditions (e.g., "The 2024-2025 tech layoffs reduced entry-level hiring by ~35%")
   - Mention actual competition levels (e.g., "A junior React role in India gets 500+ applicants on average")
   - Give realistic timelines based on hours of focused study, not motivation
   - If you don't have current data, say so — don't invent statistics

3. QUANTIFY ALWAYS
   - Bad: "It might take some time"
   - Good: "At 3 hours/day of focused practice, this skill takes 4-6 months to reach employable level"
   - Give salary ranges with location context
   - Give rough demand scores (High / Medium / Low / Declining)

4. NAME THE HARD TRUTHS
   - If a tech stack is declining, say: "This stack is losing job market share. Here's what's replacing it."
   - If a user's timeline is impossible: "You cannot become a production-ready ML engineer in 3 months. No one can. Here is a realistic 18-month path instead."
   - If a role is oversaturated: "Entry-level data science is extremely competitive in 2025. Most applicants have degrees + projects + internships. Factor this in."

5. ALWAYS GIVE A CONSTRUCTIVE PATH
   - Every hard truth must be followed by: "Here's what you can actually do:"
   - Give specific, actionable next steps
   - Prioritize steps by impact, not by ease

6. BANNED BEHAVIORS
   - Do not say "It depends" without immediately explaining what it depends on and giving a direct answer anyway
   - Do not validate bad plans just to be nice
   - Do not list 20 options when the user needs 1 clear recommendation
   - Do not use corporate jargon or motivational poster language

Always respond in markdown format.
`;

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && id) {
      fetchChatData();
    }
  }, [user, id]);

  const fetchChatData = async () => {
    try {
      setLoading(true);
      // Fetch Session
      const { data: sessionData, error: sessionError } = await insforge.database
        .from('chat_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (sessionError) throw sessionError;
      setSession(sessionData);

      // Fetch Messages
      const { data: messageData, error: messageError } = await insforge.database
        .from('chat_messages')
        .select('*')
        .eq('session_id', id)
        .order('created_at', { ascending: true });

      if (messageError) throw messageError;
      setMessages(messageData || []);
    } catch (err) {
      console.error("Failed to fetch chat data", err);
      setError("Failed to load conversation.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    setSending(true);
    setError(null);

    try {
      // 1. Save User Message
      const { data: savedUserMsg, error: userMsgError } = await insforge.database
        .from('chat_messages')
        .insert([{ session_id: id, role: 'user', content: userMessage }])
        .select()
        .single();

      if (userMsgError) throw userMsgError;
      setMessages(prev => [...prev, savedUserMsg]);

      // 2. Prepare AI Context
      const chatHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      // 3. Call AI Gateway
      const completion = await insforge.ai.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: HONEST_MENTOR_SYSTEM_PROMPT },
          ...chatHistory,
          { role: 'user', content: userMessage }
        ]
      });

      const aiResponse = completion.choices[0].message.content;

      // 4. Save AI Message
      const { data: savedAiMsg, error: aiMsgError } = await insforge.database
        .from('chat_messages')
        .insert([{ session_id: id, role: 'assistant', content: aiResponse }])
        .select()
        .single();

      if (aiMsgError) throw aiMsgError;
      setMessages(prev => [...prev, savedAiMsg]);

      // 5. Update Session Title if it's the first message
      if (session.title === 'New Conversation') {
        const newTitle = userMessage.length > 30 ? userMessage.substring(0, 30) + '...' : userMessage;
        await insforge.database
          .from('chat_sessions')
          .update({ title: newTitle })
          .eq('id', id);
        setSession(prev => ({ ...prev, title: newTitle }));
      }

    } catch (err) {
      console.error("Failed to send message", err);
      setError("Failed to get response from AI. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    try {
      const { error } = await insforge.database
        .from('chat_sessions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      console.error("Failed to delete session", err);
      alert("Failed to delete conversation.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] relative">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8a2be2]/10 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-[#8a2be2]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-md">
              {session?.title}
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">AI Mentor Session</p>
          </div>
        </div>
        <button 
          onClick={handleDeleteSession}
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          title="Delete Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-4">
            <Sparkles className="w-12 h-12 text-[#00d4ff]/20" />
            <h3 className="text-lg font-bold text-white">Start the Conversation</h3>
            <p className="text-sm text-gray-500">
              Ask TruthMentor anything about your career, skills, or the job market. 
              Expect brutally honest advice.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-[#00d4ff]/20' : 'bg-[#8a2be2]/20'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-[#00d4ff]" /> : <Sparkles className="w-4 h-4 text-[#8a2be2]" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-white/10 text-white border border-white/5' 
                    : 'bg-[#111] text-gray-200 border border-white/5'
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="max-w-[75%] flex gap-3">
              <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-[#8a2be2]/20">
                <Loader2 className="w-4 h-4 text-[#8a2be2] animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#111] text-gray-400 text-sm border border-white/5 italic">
                Analyzing market data...
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-[#0a0a0a] border-t border-white/10">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto relative"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
            placeholder="Type your question here..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-14 outline-none focus:border-[#00d4ff]/50 focus:ring-4 focus:ring-[#00d4ff]/5 transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || sending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#00d4ff] text-black rounded-xl hover:bg-[#0099cc] transition-colors disabled:opacity-50 disabled:hover:bg-[#00d4ff]"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <p className="text-[10px] text-gray-500 text-center mt-3 uppercase tracking-widest font-bold">
          TruthMentor provides objective, sometimes harsh career data. Use responsibly.
        </p>
      </div>
    </div>
  );
}

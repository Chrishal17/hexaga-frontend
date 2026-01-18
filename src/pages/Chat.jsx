import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useChat } from "../context/ChatContext";
import { Send, ShieldAlert } from "lucide-react";
import clsx from "clsx";
import EmergencyAlert from "../components/EmergencyAlert";

const Chat = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { addSession } = useChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch messages for existing session
  const fetchMessages = async (id) => {
    try {
      const { data } = await api.get(`/chat/session/${id}/messages`);
      setMessages(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchMessages(sessionId);
    } else {
      // New session: initial system message
      setMessages([
        {
          sender_role: "system",
          content:
            "Hello! I am Sprout AI. Briefly describe your symptoms, and I will guide you.",
        },
      ]);
      setInitializing(false);
    }
  }, [sessionId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input;
    setInput("");
    setLoading(true);

    try {
      let activeSessionId = sessionId;
      let isNewSession = false;

      // Create session if first message
      if (!activeSessionId) {
        const { data: session } = await api.post("/chat/session", {
          title: text.substring(0, 30),
        });
        activeSessionId = session.id;
        isNewSession = true;

        // Update URL to persist session
        navigate(`/chat/${activeSessionId}`, { replace: true });

        // Update Sidebar History Immediately
        addSession(session);
      }

      // Optimistic UI update for user message
      setMessages((prev) => [
        ...prev,
        { sender_role: "user", content: text, created_at: new Date() },
      ]);

      // Send message to AI backend
      const { data: aiMessage } = await api.post("/chat/message", {
        session_id: activeSessionId,
        content: text,
      });

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender_role: "system",
          content: "Connection Error: Failed to reach AI service.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const hasEmergency = messages.some((m) => m.metadata?.emergency_flag);
  const lastEmergency = messages
    .slice()
    .reverse()
    .find((m) => m.metadata?.emergency_flag);

  // Show loading state for new chat initialization
  if (initializing) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 mr-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Health Assistant</h2>
            <p className="text-xs text-slate-500">AI-Powered Guidance</p>
          </div>
        </div>
      </header>

      {/* Emergency Overlay */}
      {hasEmergency && lastEmergency && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <EmergencyAlert
            severity={lastEmergency.metadata.severity}
            message={lastEmergency.content}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.sender_role === "user";
          const isSystem = msg.sender_role === "system";

          if (isSystem) {
            return (
              <div key={idx} className="flex justify-center my-4">
                <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={clsx("flex", isUser ? "justify-end" : "justify-start")}
            >
              <div
                className={clsx(
                  "max-w-[80%] rounded-2xl p-4 shadow-sm",
                  isUser
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed decoration-clone">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={handleSend}
          className="relative max-w-4xl mx-auto flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms (e.g., severe headache, fever)..."
            className="w-full pl-5 pr-14 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-slate-700 placeholder:text-slate-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-2">
          Sprout AI can make mistakes. Consider checking important information.
          Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default Chat;

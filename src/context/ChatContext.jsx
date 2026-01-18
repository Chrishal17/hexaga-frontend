import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // NOTE: navigate is difficult to use here if this provider is high up,
  // but we can expose a function or let UI handle nav.
  // We'll let UI handle nav for delete.

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setSessions([]);
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const { data } = await api.get("/chat/sessions");
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const addSession = (session) => {
    setSessions((prev) => [session, ...prev]);
  };

  const deleteSession = async (id) => {
    try {
      await api.delete(`/chat/session/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete session", error);
      return false;
    }
  };

  const renameSession = async (id, newTitle) => {
    try {
      const { data } = await api.patch(`/chat/session/${id}`, {
        title: newTitle,
      });
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, title: data.title } : s))
      );
      return true;
    } catch (error) {
      console.error("Renaming failed", error);
      return false;
    }
  };

  const togglePinSession = async (id, currentStatus) => {
    try {
      const { data } = await api.patch(`/chat/session/${id}`, {
        is_pinned: !currentStatus,
      });
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === id ? { ...s, is_pinned: data.is_pinned } : s
        );
        // Re-sort: Pinned first, then date
        return updated.sort((a, b) => {
          if (a.is_pinned === b.is_pinned)
            return new Date(b.updated_at) - new Date(a.updated_at);
          return a.is_pinned ? -1 : 1;
        });
      });
      return true;
    } catch (error) {
      console.error("Pinning failed", error);
      return false;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        fetchSessions,
        addSession,
        deleteSession,
        renameSession,
        togglePinSession,
        loadingSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

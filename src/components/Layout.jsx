import { Outlet, NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Leaf,
  LogOut,
  Plus,
  MessageCircle,
  MoreVertical,
  Trash2,
  Edit2,
  Pin,
  PinOff,
} from "lucide-react";
import clsx from "clsx";
import { useToast } from "../context/ToastContext";

const Layout = () => {
  const { userRole, signOut } = useAuth();
  const {
    sessions,
    loadingSessions,
    deleteSession,
    renameSession,
    togglePinSession,
  } = useChat();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { addToast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const startNewChat = () => {
    navigate("/chat");
  };

  // Main navigation items (Contextual tools)
  const navItems = [
    { name: "Natural Remedies", path: "/remedies", icon: Leaf },
    ...(["admin", "hospital"].includes(userRole)
      ? [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }]
      : []),
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        {/* App Title */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
            <Leaf className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Sprout AI
          </span>
        </div>

        {/* New Chat Button */}
        <div className="p-4 pb-2">
          <button
            onClick={startNewChat}
            className="w-full flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all shadow-lg hover:shadow-green-900/20 group"
          >
            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
            <span className="font-semibold">New Consultation</span>
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-hide">
          <div className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            History
          </div>
          {loadingSessions ? (
            <div className="px-4 py-2 text-sm text-slate-600">
              Loading history...
            </div>
          ) : sessions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-slate-600 italic">
              No previous chats
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  currentId={sessionId}
                  onDelete={async (id) => {
                    if (confirm("Delete this chat?")) {
                      const success = await deleteSession(id);
                      if (success) {
                        if (sessionId === id) navigate("/chat");
                        addToast("Chat deleted", "success");
                      }
                    }
                  }}
                  onRename={async (id, newTitle) => {
                    await renameSession(id, newTitle);
                  }}
                  onPin={async (id, status) => {
                    await togglePinSession(id, status);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Secondary Navigation */}
        <div className="p-2 border-t border-slate-800 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center px-3 py-2 text-sm rounded-lg transition-colors font-medium",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-800/50 hover:text-white"
                )
              }
            >
              <item.icon className="w-4 h-4 mr-3 text-indigo-400" />
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative bg-white">
        <Outlet />
      </main>
    </div>
  );
};

const SessionItem = ({ session, currentId, onDelete, onRename, onPin }) => {
  const isActive = session.id === currentId;
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(session.title);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    onRename(session.id, newTitle);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleRenameSubmit} className="px-2 py-1">
        <input
          autoFocus
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className="w-full bg-slate-800 text-white text-sm px-2 py-1.5 rounded border border-slate-600 focus:border-green-500 outline-none"
        />
      </form>
    );
  }

  return (
    <div className="relative group">
      <NavLink
        to={`/chat/${session.id}`}
        className={clsx(
          "flex items-center px-3 py-3 text-sm rounded-lg transition-colors pr-8",
          isActive
            ? "bg-slate-800 text-white"
            : "hover:bg-slate-800/50 hover:text-white"
        )}
      >
        {session.is_pinned ? (
          <Pin className="w-3 h-3 mr-3 flex-shrink-0 text-green-400 fill-current" />
        ) : (
          <MessageCircle className="w-4 h-4 mr-3 flex-shrink-0 opacity-70" />
        )}
        <span className="truncate">{session.title}</span>
      </NavLink>

      {/* Context Menu Trigger */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={clsx(
          "absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-700 text-slate-400",
          showMenu && "opacity-100 bg-slate-700"
        )}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-10 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
        >
          <button
            onClick={() => {
              onPin(session.id, session.is_pinned);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-700 flex items-center text-slate-200"
          >
            {session.is_pinned ? (
              <PinOff className="w-3 h-3 mr-2" />
            ) : (
              <Pin className="w-3 h-3 mr-2" />
            )}
            {session.is_pinned ? "Unpin" : "Pin Chat"}
          </button>
          <button
            onClick={() => {
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-700 flex items-center text-slate-200"
          >
            <Edit2 className="w-3 h-3 mr-2" />
            Rename
          </button>
          <div className="h-px bg-slate-700 my-1" />
          <button
            onClick={() => {
              onDelete(session.id);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-900/30 text-red-400 flex items-center"
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;

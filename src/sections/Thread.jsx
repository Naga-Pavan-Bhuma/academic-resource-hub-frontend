import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaSmile, FaUserCircle, FaRegCommentDots } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";

// ALWAYS use socket URL
const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
  transports: ["websocket", "polling"],
});

export default function Thread({
  thread = { comments: [] },
  user = {},
  onAddComment,
  setThread,
}) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Typing system
  const [typingUsers, setTypingUsers] = useState([]);
  const typingRef = useRef([]);
  const typingTimeoutRef = useRef(null);

  // Online users count
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Auto scroll only for messages (not typing indicator)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 80);
  }, [thread.comments?.length]);

  // Join & leave socket room
  useEffect(() => {
    if (!thread?._id) return;

    socket.emit("join_thread", thread._id);
    return () => socket.emit("leave_thread", thread._id);
  }, [thread._id]);

  // Online users listener
  useEffect(() => {
    const handler = ({ threadId, count }) => {
      if (threadId === thread._id) setOnlineUsers(count);
    };
    socket.on("thread_users", handler);
    return () => socket.off("thread_users", handler);
  }, [thread._id]);

  // Real-time messages
  useEffect(() => {
    const handler = ({ threadId, comment }) => {
      if (threadId !== thread._id) return;

      setThread((prev) => ({
        ...prev,
        comments: [...prev.comments, comment],
      }));
    };

    socket.on("new_comment", handler);
    return () => socket.off("new_comment", handler);
  }, [thread._id]);

  // Add/remove typing users
  const addTyping = (u) => {
    if (!typingRef.current.some((x) => x._id === u._id)) {
      typingRef.current.push(u);
      setTypingUsers([...typingRef.current]);
    }
  };

  const removeTyping = (u) => {
    typingRef.current = typingRef.current.filter((x) => x._id !== u._id);
    setTypingUsers([...typingRef.current]);
  };

  // Typing listeners
  useEffect(() => {
    const handleTyping = ({ user }) => addTyping(user);
    const handleStopTyping = ({ user }) => removeTyping(user);

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, []);

  // Emit typing events
  const emitTyping = () => {
    if (!thread?._id) return;

    socket.emit("typing", { threadId: thread._id, user });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { threadId: thread._id, user });
    }, 600);
  };

  // Send message
  const handleSend = async () => {
    if (!comment.trim() || sending) return;

    setSending(true);
    await onAddComment(thread._id, comment.trim());
    setComment("");
    inputRef.current?.focus();
    setSending(false);

    // stop typing immediately
    socket.emit("stop_typing", { threadId: thread._id, user });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Emoji handling
  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const ref = inputRef.current;

    if (!ref) return setComment((prev) => prev + emoji);

    const start = ref.selectionStart;
    const end = ref.selectionEnd;

    const updated = comment.slice(0, start) + emoji + comment.slice(end);
    setComment(updated);

    setTimeout(() => {
      ref.focus();
      ref.selectionStart = ref.selectionEnd = start + emoji.length;
    }, 0);
  };

  const comments = Array.isArray(thread.comments) ? thread.comments : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="w-full h-full flex flex-col bg-white/60 backdrop-blur-md border border-slate-100 rounded-2xl shadow-lg"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md">
            <FaRegCommentDots size={18} />
          </div>

          <div>
            <div className="text-lg font-semibold text-slate-800">
              {thread.title}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <FaUserCircle className="opacity-70" />
              <span>{thread.createdBy?.name}</span>
              <span>•</span>
              <span>{new Date(thread.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-green-600">{onlineUsers} online</div>
      </div>

      {/* MESSAGES */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-5 space-y-4"
      >
        <AnimatePresence initial={false}>
          {comments.map((c, idx) => {
            const mine = user?._id === c?.postedBy?._id;
            const key = c._id || idx;

            return (
              <motion.article
                key={key}
                initial={{ opacity: 0, x: mine ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`max-w-3xl ${
                  mine ? "ml-auto text-right" : "mr-auto text-left"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap ${
                    mine
                      ? "bg-gradient-to-tr from-indigo-500 to-sky-500 text-white"
                      : "bg-slate-50 border border-slate-100 text-slate-800"
                  }`}
                >
                  {!mine && (
                    <div className="text-xs text-slate-500 mb-1">
                      {c.postedBy?.name}
                    </div>
                  )}
                  <div>{c.text}</div>
                  <div
                    className={`text-[11px] mt-1 ${
                      mine ? "text-indigo-100" : "text-slate-400"
                    }`}
                  >
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* FIXED TYPING INDICATOR (BOTTOM AREA) */}
      <div className="px-5 pb-1 min-h-[18px]">
        {typingUsers.length > 0 && (
          <div className="text-xs text-sky-600 animate-pulse">
            {typingUsers.map((u) => u.name).join(", ")} typing…
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="border-t border-slate-100 px-4 py-3 bg-white/60 rounded-b-2xl">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <FaSmile className="text-slate-500" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" />
              </div>
            )}
          </div>

          <textarea
            ref={inputRef}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              emitTyping();
            }}
            onKeyDown={onKeyDown}
            placeholder="Write a helpful comment... (Enter to send)"
            className="flex-1 resize-none min-h-[44px] max-h-40 px-4 py-3 rounded-lg border border-slate-200"
          />

          <button
            onClick={handleSend}
            disabled={!comment.trim() || sending}
            className="px-3 py-2 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 text-white shadow"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

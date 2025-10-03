import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaSmile,
  FaUserCircle,
  FaRegCommentDots,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

export default function Thread({
  thread = { comments: [] },
  user = {},
  onAddComment,
}) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 80);
    return () => clearTimeout(t);
  }, [thread, thread?.comments?.length]);

  const initials = (name = "") => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  };

  const handleSend = async () => {
    const text = comment.trim();
    if (!text || !onAddComment || sending) return;
    try {
      setSending(true);
      await Promise.resolve(onAddComment(thread._id, text));
      setComment("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Failed to send comment", err);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // insert emoji into textarea
  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const ref = inputRef.current;
    if (!ref) {
      setComment((prev) => prev + emoji);
      return;
    }

    const start = ref.selectionStart;
    const end = ref.selectionEnd;
    const before = comment.substring(0, start);
    const after = comment.substring(end);
    const newText = before + emoji + after;
    setComment(newText);

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
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="w-full h-full flex flex-col bg-white/60 backdrop-blur-md border border-slate-100 rounded-2xl shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md">
            <FaRegCommentDots size={18} />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-800 leading-tight">
              {thread.title}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <FaUserCircle className="opacity-70" />
              <span>{thread.createdBy?.name || "Started by Anonymous"}</span>
              <span className="mx-1">•</span>
              <time
                dateTime={thread.createdAt || ""}
                className="text-xs text-slate-400"
              >
                {thread.createdAt
                  ? new Date(thread.createdAt).toLocaleString()
                  : ""}
              </time>
            </div>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
      >
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 shadow-sm mb-4">
              <FaRegCommentDots className="text-slate-400" size={28} />
            </div>
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.8,
              }}
              className="text-slate-500 font-medium"
            >
              No comments yet — be the first to start the discussion
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {comments.map((c, idx) => {
                const isUser =
                  user?._id && c.postedBy?._id && user._id === c.postedBy._id;
                const key = c._id || `${idx}-${c.createdAt || ""}`;
                return (
                  <motion.article
                    key={key}
                    initial={{ opacity: 0, x: isUser ? 20 : -20, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: isUser ? 20 : -20 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className={`max-w-3xl ${
                      isUser ? "ml-auto text-right" : "mr-auto text-left"
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-2xl shadow-sm break-words whitespace-pre-wrap ${
                        isUser
                          ? "bg-gradient-to-tr from-indigo-500 to-sky-500 text-white"
                          : "bg-slate-50 border border-slate-100 text-slate-800"
                      }`}
                    >
                      {/* Name for non-user */}
                      {!isUser && (
                        <div className="text-xs text-slate-500 font-medium mb-1">
                          {c.postedBy?.name || "Anonymous"}
                        </div>
                      )}

                      {/* Message text */}
                      <div>{c.text}</div>

                      {/* Timestamp */}
                      <div
                        className={`text-[11px] mt-1 ${
                          isUser ? "text-indigo-100/90" : "text-slate-400"
                        }`}
                      >
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="relative border-t border-slate-100 px-4 py-3 bg-white/60 rounded-b-2xl">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {/* Emoji button */}
          <div className="relative">
            <button
              type="button"
              aria-label="Emoji"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <FaSmile className="text-slate-500" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" />
              </div>
            )}
          </div>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Write a helpful comment... (Enter to send)"
            className="flex-1 resize-none min-h-[44px] max-h-40 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 placeholder-slate-400 text-sm"
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!comment.trim() || sending}
            aria-label="Send comment"
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 bg-gradient-to-tr from-indigo-500 to-sky-400 text-white shadow hover:brightness-105 disabled:opacity-80 transition transform active:scale-95"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

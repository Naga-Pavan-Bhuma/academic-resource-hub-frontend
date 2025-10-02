import React, { useEffect, useState, useRef } from "react";

function Thread({ thread, user, onAddComment }) {
  const [comment, setComment] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onAddComment(thread._id, comment.trim());
    setComment("");
  };

  return (
    <div className="thread-container border-4 border-sky-200 rounded-3xl p-6 mt-4 shadow-lg bg-gradient-to-br from-pink-50 to-sky-100 max-h-[550px] flex flex-col animate-fadeInUp">
      <h3 className="font-semibold mb-6 border-b-2 border-pink-200 pb-3 text-3xl text-sky-600 select-none">
        {thread.title}
      </h3>
      <div className="messages flex-grow overflow-y-auto mb-6 space-y-4 px-2">
        {thread.comments.length === 0 && (
          <p className="text-pink-300 text-center text-xl font-semibold animate-pulse">No comments yet.</p>
        )}
        {thread.comments.map((c, i) => {
          const isUser = user?._id === c.postedBy?._id;
          return (
            <div
              key={i}
              className={`message max-w-[75%] p-4 rounded-2xl shadow-md transition transform ${
                isUser
                  ? "bg-sky-300 text-sky-900 self-end animate-scaleUp"
                  : "bg-pink-200 text-pink-700 self-start animate-slideInLeft"
              }`}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {!isUser && (
                <div className="font-semibold mb-2 select-text">{c.postedBy?.name || "Anonymous"}</div>
              )}
              <div className="text-lg leading-relaxed">{c.text}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-4">
        <input
          className="flex-grow border-2 border-pink-300 rounded-full p-4 text-lg placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-sky-300 transition shadow-sm hover:shadow-md active:scale-95"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Type your comment..."
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          className="bg-gradient-to-r from-sky-400 to-pink-300 text-sky-900 font-bold px-8 rounded-full shadow-md hover:from-pink-300 hover:to-sky-400 transform transition hover:scale-105 active:scale-95 select-none"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Thread;

import React from "react";
import { FaComments, FaUser } from "react-icons/fa";

const discussions = [
  { title: "How to prepare for DBMS exam?", replies: 2, postedBy: "Arjun" },
  { title: "Can anyone share last year’s CN notes?", replies: 5, postedBy: "Meena" },
  { title: "Best resources for learning Python?", replies: 8, postedBy: "Ravi" },
  { title: "Tips for solving coding questions quickly", replies: 3, postedBy: "Sneha" },
  { title: "Clarification on Operating Systems assignment", replies: 1, postedBy: "Tejaswi" },
  { title: "Which books are good for AI and ML?", replies: 4, postedBy: "Anirudh" },
];

const DiscussionBoard = () => {
  return (
    <section className="p-6 min-h-screen">
      <h2 className="text-3xl font-fredoka font-bold text-cyan-700 mb-8 text-center">
        💬 Recent Discussions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {discussions.map((discussion, index) => (
          <div
            key={index}
            className="relative bg-white/20 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl hover:shadow-cyan-400/50 transition transform hover:scale-105 cursor-pointer overflow-hidden"
          >
            {/* Decorative top-right circle */}
            <div className="absolute top-0 right-0 w-14 h-14 bg-cyan-300/30 rounded-full -translate-x-1/3 translate-y-1/3 animate-pulse"></div>

            <div className="flex items-center gap-3 mb-4">
              <FaComments className="text-cyan-500 text-2xl" />
              <h3 className="font-bold text-lg text-cyan-700">{discussion.title}</h3>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 bg-cyan-100/60 text-cyan-800 text-xs px-3 py-1 rounded-full font-semibold">
                <FaComments /> {discussion.replies} Replies
              </span>
              <span className="flex items-center gap-1 bg-blue-100/60 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                <FaUser /> {discussion.postedBy}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscussionBoard;

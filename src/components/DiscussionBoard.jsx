import React from "react";

const discussions = [
  {
    title: "How to prepare for DBMS exam?",
    replies: 2,
    postedBy: "Arjun",
  },
  {
    title: "Can anyone share last year’s CN notes?",
    replies: 5,
    postedBy: "Meena",
  },
  {
    title: "Best resources for learning Python?",
    replies: 8,
    postedBy: "Ravi",
  },
  {
    title: "Tips for solving coding questions quickly",
    replies: 3,
    postedBy: "Sneha",
  },
  {
    title: "Clarification on Operating Systems assignment",
    replies: 1,
    postedBy: "Tejaswi",
  },
  {
    title: "Which books are good for AI and ML?",
    replies: 4,
    postedBy: "Anirudh",
  },
];

const DiscussionBoard = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Discussions</h2>
      <div className="space-y-3">
        {discussions.map((discussion, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <p className="font-medium text-gray-800">{discussion.title}</p>
            <p className="text-sm text-gray-500">
              {discussion.replies} replies • Posted by {discussion.postedBy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscussionBoard;

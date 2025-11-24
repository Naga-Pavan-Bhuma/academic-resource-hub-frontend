import React from "react";

export default function ActivityFeed({ activities }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border h-[321px] overflow-y-auto">
      <h2 className="font-semibold mb-2">Recent Activity</h2>
      <p className="text-gray-600 text-sm mb-3">Your last interactions</p>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity...</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {activities.map((a, i) => (
            <li key={i} className="flex items-start gap-2">
              <span>⚡</span>
              <div className="flex-1">
                <p className="text-gray-800">{a.message}</p>
                <span className="text-gray-400 text-xs">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_BASE;

export default function useActivity(userId) {
  const [activities, setActivities] = useState([]);

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API}/activity`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to load activity");
    }
  };

  useEffect(() => {
    if (!userId) return;

    loadHistory();

    const socket = io(API.replace("/api", ""));

    socket.on("activity:new", (data) => {
      if (data.userId === userId) {
        setActivities((prev) => [data, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [userId]);

  return activities;
}

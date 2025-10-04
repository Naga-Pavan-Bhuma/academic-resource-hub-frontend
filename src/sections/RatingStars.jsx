import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const RatingStars = ({ resourceId, userId }) => {
  const [rating, setRating] = useState(0);       // previous user rating
  const [hover, setHover] = useState(0);         // hover state
  const [selected, setSelected] = useState(0);   // clicked rating
  const [submitted, setSubmitted] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;

  // Fetch previous rating from backend
  useEffect(() => {
    if (!resourceId || !userId) return;

    axios
      .get(`${API_BASE}/resources/${resourceId}/rating?userId=${userId}`)
      .then((res) => {
        const userRating = res.data.average || 0;
        setRating(userRating);
        setSelected(userRating); // highlight stars initially
      })
      .catch((err) => console.error("Failed to fetch rating", err));
  }, [resourceId, userId]);

  const handleClick = (value) => {
    setSelected(value);
    setShowSubmit(true);  // show submit button only when a new star is clicked
  };

  const handleSubmit = async () => {
    if (!selected) return alert("Please select a rating first");

    try {
      await axios.post(`${API_BASE}/resources/${resourceId}/rate`, {
        userId,
        value: selected,
      });
      setRating(selected);       // update previous rating
      setSubmitted(true);
      setShowSubmit(false);      // hide submit button
      setTimeout(() => setSubmitted(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          size={20}
          className={`cursor-pointer transition ${
            i <= (hover || selected || rating) ? "text-yellow-400" : "text-gray-300"
          }`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleClick(i)}
        />
      ))}

      {showSubmit && (
        <button
          onClick={handleSubmit}
          className="ml-2 px-3 py-1 rounded text-white text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition"
        >
          Submit
        </button>
      )}

      {submitted && (
        <span className="ml-2 text-sm text-green-600 font-medium">Submitted</span>
      )}
    </div>
  );
};

export default RatingStars;

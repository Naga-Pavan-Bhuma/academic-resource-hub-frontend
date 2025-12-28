import React, { useState, useRef } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";

const API_BASE = import.meta.env.VITE_API_BASE;

const PdfChat = ({ pdfUrl }) => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

 const sendQuestion = async () => {
  if (!question.trim()) return;

  const userMsg = { text: question, sender: "user" };
  setMessages((prev) => [...prev, userMsg]);
  setQuestion("");
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API_BASE}/pdf/chat`,
      { pdfUrl, question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const botMsg = {
      text: res.data.answer,
      sender: "bot",
    };

    setMessages((prev) => [...prev, botMsg]);
  } catch (err) {
    console.error(err);
    alert("Failed to get answer");
  } finally {
    setLoading(false);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
};


  return (
    <div className="h-full flex flex-col">

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-gray-400 text-sm text-center mt-6">
            Ask doubts related to this PDF 📘
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble key={idx} {...msg} />
        ))}

        {loading && (
          <div className="text-gray-400 text-sm self-start">
            AI is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this PDF..."
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={sendQuestion}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-md text-sm font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PdfChat;

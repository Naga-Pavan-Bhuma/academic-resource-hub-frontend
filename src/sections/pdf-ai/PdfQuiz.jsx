import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const PdfQuiz = ({ pdfUrl }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [results, setResults] = useState(null);

  const generateQuiz = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE}/pdf/quiz`,
        { pdfUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(null));
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, option) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = option;
    setAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE}/pdf/quiz/submit`,
        {
          quizId: quiz._id,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScore(res.data.score);
      setResults(res.data.results); // ✅ NEW
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4">

      {/* Generate Button */}
      {!quiz && (
        <button
          onClick={generateQuiz}
          className="bg-emerald-500 text-white py-2 rounded-md font-semibold"
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      )}

      {/* Quiz */}
      {quiz && score === null && (
        <div className="flex-1 overflow-y-auto space-y-4">

          {quiz.questions.map((q, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-2">
                {i + 1}. {q.question}
              </p>

              <div className="flex flex-col gap-2">
                {q.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(i, opt)}
                    className={`text-left px-3 py-2 rounded-md border
                      ${
                        answers[i] === opt
                          ? "bg-emerald-500 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Submit */}
          <button
            onClick={submitQuiz}
            className="bg-blue-500 text-white py-2 rounded-md font-semibold"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {/* Score Screen */}
      {score !== null && results && (
  <div className="flex flex-col gap-4 overflow-y-auto">

    <h2 className="text-xl font-bold text-emerald-600 text-center">
      🎉 Score: {score} / {quiz.questions.length}
    </h2>

    {results.map((r, i) => (
      <div key={i} className="p-3 rounded-md border bg-gray-50">

        <p className="font-medium">
          {i + 1}. {r.question}
        </p>

        {/* Your answer */}
        <p className={`mt-1 ${
          r.isCorrect ? "text-green-600" : "text-red-500"
        }`}>
          Your Answer: {r.selected || "Not answered"}
        </p>

        {/* Correct answer (only if wrong) */}
        {!r.isCorrect && (
          <p className="text-green-600">
            Correct Answer: {r.correct}
          </p>
        )}

      </div>
    ))}

    <button
      onClick={() => {
        setQuiz(null);
        setScore(null);
        setResults(null); // ✅ IMPORTANT
        setAnswers([]);
      }}
      className="mt-4 bg-gray-800 text-white py-2 rounded-md"
    >
      Try Another Quiz
    </button>
  </div>
)}
    </div>
  );
};

export default PdfQuiz;
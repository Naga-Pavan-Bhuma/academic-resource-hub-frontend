const MessageBubble = ({ text, sender }) => {
  return (
    <div
      className={`max-w-[80%] px-4 py-2 rounded-lg text-sm leading-relaxed ${
        sender === "user"
          ? "bg-emerald-500 text-white self-end"
          : "bg-gray-200 text-gray-800 self-start"
      }`}
    >
      {text}
    </div>
  );
};

export default MessageBubble;

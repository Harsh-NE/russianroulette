const MessageBubble = ({ message, sender }) => {

  const role = localStorage.getItem("role");

  const isCurrentUser = sender === role;

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          max-w-[70%] px-4 py-2 rounded-lg
          ${isCurrentUser
            ? "bg-red-600 text-white rounded-tr-none"
            : sender === "bot"
            ? "bg-gray-800 text-white rounded-tl-none"
            : "bg-blue-600 text-white rounded-tl-none"}
        `}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
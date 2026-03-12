const MessageBubble = ({ message, isBot }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`
          max-w-[70%] px-4 py-2 rounded-lg
          ${isBot 
            ? 'bg-gray-800 text-white rounded-tl-none' 
            : 'bg-red-600 text-white rounded-tr-none'
          }
        `}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
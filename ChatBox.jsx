import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatBox = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[500px] bg-gray-900 rounded-lg">
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg.text}
          isBot={msg.isBot}
        />
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBox;
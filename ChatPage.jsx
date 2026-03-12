import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import InputBar from "../components/InputBar";
import API from "../api/api";

const ChatPage = () => {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const roomCode = localStorage.getItem("roomCode");

  // OPEN CHAT + LOAD HISTORY
  useEffect(() => {
    const initChat = async () => {
      try {

        await API.post("/chat/open", {
          roomCode: roomCode,
          position: parseInt(slotId)
        });

        const res = await API.get(`/chat/history/${roomCode}/${slotId}`);

        // Convert backend format → frontend format
        const formatted = (res.data.messages || []).map(m => ({
          text: m.text,
          isBot: m.sender !== "investigator"
        }));

        setMessages(formatted);

      } catch (err) {
        console.log(err);
      }
    };

    initChat();
  }, [slotId]);

  const handleSendMessage = async (message) => {
    // Show investigator message immediately
    setMessages(prev => [
      ...prev,
      { text: message, isBot: false }
    ]);

    setLoading(true);

    try {

      const res = await API.post("/chat/send", {
        roomCode: roomCode,
        targetPosition: parseInt(slotId),
        message: message
      });

      // Bot reply
      if (res.data.reply) {
        setMessages(prev => [
          ...prev,
          { text: res.data.reply, isBot: true }
        ]);
      }

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleReturn = () => {
    navigate("/investigator");
  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-4">
        <h1 className="stencil-text text-3xl font-bold">
          Compartment {slotId}
        </h1>

        <button
          onClick={handleReturn}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Return to Board
        </button>
      </div>

      <ChatBox messages={messages} loading={loading} />

      <InputBar onSendMessage={handleSendMessage} disabled={false} />

    </div>
  );
};

export default ChatPage;
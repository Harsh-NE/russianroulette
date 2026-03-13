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
  const [activeSlot, setActiveSlot] = useState(null);
  const [inputEnabled, setInputEnabled] = useState(false);

  const roomCode = localStorage.getItem("roomCode");

  // ----------------------------
  // 1️⃣ Open chat for this slot
  // ----------------------------
  useEffect(() => {
    const openChat = async () => {
      try {
        await API.post("/chat/open", {
          roomCode,
          position: parseInt(slotId, 10),
        });
      } catch (err) {
        console.log(err);
      }
    };
    openChat();
  }, [slotId, roomCode]);

  // ----------------------------
  // 2️⃣ Poll for active slot
  // ----------------------------
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/game/visited/${roomCode}`);
        const visited = res.data.visitedPositions || [];
        if (visited.length > 0) setActiveSlot(visited[visited.length - 1]);
      } catch (err) {
        console.log(err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [roomCode]);

  // ----------------------------
  // 3️⃣ Enable input if active slot matches this slot
  // ----------------------------
  useEffect(() => {
    if (activeSlot === parseInt(slotId, 10)) {
      setInputEnabled(true);
    } else {
      setInputEnabled(false);
    }
  }, [activeSlot, slotId]);

  // ----------------------------
  // 4️⃣ Poll chat history
  // ----------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get(`/chat/history/${roomCode}/${slotId}`);
        const formatted = (res.data.messages || []).map((m) => ({
          text: m.text,
          sender: m.sender,
        }));
        setMessages(formatted);
      } catch (err) {
        console.log(err);
      }
    };

    const interval = setInterval(fetchHistory, 1500);
    return () => clearInterval(interval);
  }, [slotId, roomCode]);

  // ----------------------------
  // 5️⃣ Send message
  // ----------------------------
  const handleSendMessage = async (message) => {
    if (!inputEnabled) return;

    setMessages((prev) => [
      ...prev,
      { text: message, sender: "investigator" },
    ]);

    try {
      await API.post("/chat/send", {
        roomCode,
        targetPosition: parseInt(slotId, 10),
        message,
        sender: "investigator",
      });
    } catch (err) {
      console.log(err);
    }
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

      <div className="bg-gray-900 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-400">
          {inputEnabled
            ? "You can send messages in this compartment."
            : "Waiting for this compartment to be active..."}
        </p>
      </div>

      <ChatBox messages={messages} loading={loading} />
      <InputBar onSendMessage={handleSendMessage} disabled={!inputEnabled} />
    </div>
  );
};

export default ChatPage;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import InputBar from "../components/InputBar";
import API from "../api/api";

const ImposterDashboard = () => {

  const [imposterSlot, setImposterSlot] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputEnabled, setInputEnabled] = useState(false);

  const navigate = useNavigate();

  const roomCode = localStorage.getItem("roomCode");

  // --------------------------------
  // 1️⃣ GET IMPOSTER SLOT FROM BACKEND
  // --------------------------------
  useEffect(() => {

    const fetchImposter = async () => {

      try {

        const res = await API.get(`/player/imposter/${roomCode}`);
        setImposterSlot(res.data.position);

      } catch (err) {
        console.log(err);
      }

    };

    fetchImposter();

  }, [roomCode]);

  // --------------------------------
  // 2️⃣ CHECK ACTIVE SLOT
  // --------------------------------
  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const res = await API.get(`/game/visited/${roomCode}`);

        const visited = res.data.visitedPositions || [];

        if (visited.length > 0) {
          const current = visited[visited.length - 1];
          setActiveSlot(current);
        }

      } catch (err) {
        console.log(err);
      }

    }, 1500);

    return () => clearInterval(interval);

  }, [roomCode]);

  // --------------------------------
  // 3️⃣ ENABLE INPUT IF SLOT MATCHES
  // --------------------------------
  useEffect(() => {

    if (activeSlot === imposterSlot) {
      setInputEnabled(true);
    } else {
      setInputEnabled(false);
    }

  }, [activeSlot, imposterSlot]);

  // --------------------------------
  // 4️⃣ LOAD CHAT HISTORY
  // --------------------------------
  useEffect(() => {

  const fetchHistory = async () => {

    if (!imposterSlot) return;

    try {

      const res = await API.get(`/chat/history/${roomCode}/${imposterSlot}`);

      const formatted = (res.data.messages || []).map(m => ({
        text: m.text,
        isBot: m.sender === "investigator"
      }));

      setMessages(formatted);

    } catch (err) {
      console.log(err);
    }

  };

  const interval = setInterval(fetchHistory, 1500);

  return () => clearInterval(interval);

}, [imposterSlot, activeSlot,roomCode]);

  // --------------------------------
  // 5️⃣ CHECK GAME FINISHED
  // --------------------------------
  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const res = await API.get(`/game/result/${roomCode}`);

        if (res.data.gameFinished) {
          clearInterval(interval);
          navigate("/result");
        }

      } catch (err) {
        console.log(err);
      }

    }, 1500);

    return () => clearInterval(interval);

  }, [navigate]);

  // --------------------------------
  // 6️⃣ SEND MESSAGE
  // --------------------------------
  const handleSendMessage = async (message) => {
    if (!inputEnabled) return;
    setMessages(prev => [
      ...prev,
      { text: message, isBot: false }
    ]);

    try {

      await API.post("/chat/send", {
        roomCode: roomCode,
        targetPosition: imposterSlot,
        message: message
      });

    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-4">
        <h1 className="stencil-text text-3xl font-bold">
          IMPOSTER DASHBOARD
        </h1>

        <div className="text-right">
          <p className="text-red-600">
            Your slot: Compartment {imposterSlot}
          </p>

          <p className="text-sm text-gray-400">
            Active: Compartment {activeSlot || "None"}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg mb-4">

        <h2 className="text-xl font-bold mb-2">
          Conversation Monitor
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          {inputEnabled
            ? "Your slot is active! You can now send messages."
            : "Waiting for investigator to open your compartment..."}
        </p>

      </div>

      <ChatBox messages={messages} loading={false} />

      <InputBar
        onSendMessage={handleSendMessage}
        disabled={!inputEnabled}
      />

      <button
        onClick={() => navigate("/")}
        className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Exit to Menu
      </button>

    </div>
  );
};

export default ImposterDashboard;
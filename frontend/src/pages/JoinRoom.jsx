import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api/api";
const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
  e.preventDefault();

  try {

    const playerName = "Player_" + Math.floor(Math.random() * 1000);

    const res = await API.post("/room/join", {
      roomCode: roomCode,
      name: playerName
    });

    localStorage.setItem("playerId", res.data.playerId);
    localStorage.setItem("roomCode", roomCode);
    localStorage.setItem("name", playerName);
    //localStorage.setItem("position", res.data.position);

    navigate("/role");

  } catch (err) {
    alert("Room not found or full");
    console.error("Join room error:", err);
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      console.error("Response headers:", err.response.headers);
      alert(err.response.data?.message || "Room not found or full");
    } else if (err.request) {
      console.error("Request made but no response received:", err.request);
      alert("No response from server");
    } else {
      console.error("Error setting up request:", err.message);
      alert("Error: " + err.message);
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="stencil-text text-4xl font-bold text-center mb-8">Enter Room Code</h1>
        
        <form onSubmit={handleJoin} className="space-y-6">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full bg-gray-900 text-white text-center text-2xl tracking-[0.5em] px-4 py-4 rounded-lg border-2 border-white focus:border-red-600 focus:outline-none transition-colors"
          />
          
          <button
            type="submit"
            disabled={!roomCode.trim()}
            className="w-full px-8 py-4 bg-red-600 text-white text-xl font-bold rounded-lg
                     hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RevolverBoard from '../components/RevolverBoard';
import API from "../api/api";

const InvestigatorDashboard = () => {
  const [visitedSlots, setVisitedSlots] = useState([]);
  const [timeLeft, setTimeLeft] = useState(18 * 60); // 18 minutes in seconds
  const navigate = useNavigate();

  const roomCode = localStorage.getItem("roomCode");
  
 useEffect(() => {
  let startTime = localStorage.getItem("gameStartTime");

  if (!startTime) {
    // New game session
    startTime = Date.now();
    localStorage.setItem("gameStartTime", startTime);
  }

  startTime = parseInt(startTime, 10);

  // Set initial timeLeft immediately
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  setTimeLeft(Math.max(0, 18 * 60 - elapsed));

  const interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = 18 * 60 - elapsed;

    if (remaining <= 0) {
      setTimeLeft(0);
      localStorage.removeItem("gameStartTime"); // clear session
      navigate("/guess_frontend");
    } else {
      setTimeLeft(remaining);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [navigate]);



  // Load visited slots from DB
  const loadVisited = async () => {
    try {
      const res = await API.get(`/game/visited/${roomCode}`);
      console.log("Visited slots from API:", res.data.visitedPositions);
      setVisitedSlots(res.data.visitedPositions || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadVisited();
  }, []);


  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSlotClick = async (slotIndex) => {
    const position = slotIndex + 1;

    if (visitedSlots.includes(position)) return;

    try {
      await API.post("/chat/open", {
        roomCode,
        position
      });

      // refresh from DB
      await loadVisited();
      navigate(`/chat/${position}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGuessClick = () => {
    localStorage.removeItem("gameStartTime");
    navigate('/guess_frontend');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="stencil-text text-4xl font-bold">
          INVESTIGATOR DASHBOARD
        </h1>
        
        {/* Timer Display */}
        <div className="bg-gray-900 px-6 py-3 rounded-lg border-2 border-red-600">
          <span className="text-3xl font-mono font-bold text-red-600">
            {formatTime()}
          </span>
        </div>
      </div>

      <p className="text-gray-400 mb-8">
        Visited {visitedSlots.length}/6 compartments
      </p>

      <RevolverBoard
        visitedSlots={visitedSlots.map(v => v - 1)}
        onSlotClick={handleSlotClick}
      />

      <div className="mt-8 flex gap-4 mb-8">
        {visitedSlots.map((slotIndex) => (
          <div key={slotIndex} className="w-3 h-3 bg-gray-600 rounded-full"></div>
        ))}
        {Array(6 - visitedSlots.length).fill(0).map((_, i) => (
          <div key={i} className="w-3 h-3 border border-gray-600 rounded-full"></div>
        ))}
      </div>

      {/* Make a Guess Button */}
      <button
        onClick={handleGuessClick}
        className="px-12 py-4 bg-red-600 text-white text-xl font-bold rounded-lg
                 hover:bg-red-700 transition-all duration-300 transform hover:scale-105
                 shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)]
                 mt-4"
      >
        MAKE A GUESS
      </button>
    </div>
  );
};

export default InvestigatorDashboard;
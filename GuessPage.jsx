import { useNavigate } from 'react-router-dom';
import RevolverBoard from '../components/RevolverBoard';
import API from "../api/api";

const GuessPage = () => {
  const navigate = useNavigate();
  const slots = [1, 2, 3, 4, 5, 6];

  const handleSlotClick = async (slotIndex) => {
    const roomCode = localStorage.getItem("roomCode");
    const guessPosition = slotIndex + 1; // 1-based

    try {
      // Send guess to backend
      await API.post("/game/guess", {
        roomCode,
        guessPosition,
      });

      // Save guess locally to decide result
      localStorage.setItem("guessPosition", guessPosition);
      
      // Navigate to result page
      navigate("/result");
    } catch (err) {
      console.log("Error submitting guess:", err);
      localStorage.setItem("guessPosition", guessPosition);
      navigate("/result");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="stencil-text text-4xl font-bold mb-4">MAKE YOUR GUESS</h1>
      <p className="text-gray-400 mb-8">
        Select which compartment contains the human
      </p>

      <RevolverBoard
        visitedSlots={[]} // no slots visited yet
        onSlotClick={handleSlotClick}
      />
    </div>
  );
};

export default GuessPage;
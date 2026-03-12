import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const ResultPage = () => {
  const [result, setResult] = useState(null);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchResult = async () => {

    const roomCode = localStorage.getItem("roomCode");

    try {

      const res = await API.get(`/game/result/${roomCode}`);

      const { imposterPosition, investigatorGuess, gameFinished } = res.data;

      if (!gameFinished) return;

      if (investigatorGuess === imposterPosition) {
        setResult("imposter_eliminated");
      } else {
        setResult("investigator_eliminated");
      }

      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);

    } catch (err) {
      console.log("Error fetching result:", err);
    }

  };

  fetchResult();
}, []);

  const handleRestart = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`text-center ${animate ? "animate-shake" : ""}`}>
        <div className={`mb-8 p-12 rounded-lg ${animate ? "animate-flash" : ""}`}>
          {result === "imposter_eliminated" ? (
            <>
              <h1 className="stencil-text text-6xl font-bold text-red-600 mb-4">
                IMPOSTER
              </h1>
              <h2 className="stencil-text text-5xl font-bold text-white">
                ELIMINATED
              </h2>
            </>
          ) : result === "investigator_eliminated" ? (
            <>
              <h1 className="stencil-text text-6xl font-bold text-red-600 mb-4">
                INVESTIGATOR
              </h1>
              <h2 className="stencil-text text-5xl font-bold text-white">
                ELIMINATED
              </h2>
            </>
          ) : (
            <h2 className="stencil-text text-4xl text-gray-400">Loading...</h2>
          )}
        </div>

        <button
          onClick={handleRestart}
          className="px-12 py-4 bg-red-600 text-white text-xl font-bold rounded-lg hover:bg-red-700"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
import { useNavigate } from 'react-router-dom';
import RevolverCylinder from '../components/RevolverCylinder';
import GameTitle from '../components/GameTitle';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 max-w-6xl">
        {/* Left side - Revolver */}
        <div className="w-full md:w-1/2 flex justify-center">
          <RevolverCylinder />
        </div>
        
        {/* Right side - Title and button */}
        <div className="w-full md:w-1/2 text-center md:text-right">
          <GameTitle />
          
          <div className="mt-12">
            <button
              onClick={() => navigate('/join')}
              className="px-12 py-4 bg-red-600 text-white text-xl font-bold rounded-lg
                       hover:bg-red-700 transition-all duration-300 transform hover:scale-105
                       shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)]"
            >
              START GAME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
import { useNavigate } from 'react-router-dom';
import API from "../api/api";
const RoleSelect = () => {
  const navigate = useNavigate();

  const handleRoleSelect = async (role) => {

  const name = localStorage.getItem("name");

  try {

    await API.post("/room/select-role", {
      roomCode: localStorage.getItem("roomCode"),
      name: name,
      role: role
    });

    localStorage.setItem("role", role);

    navigate(`/${role}`);

  } catch (err) {
    alert("Role selection failed");
  }

};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="stencil-text text-5xl font-bold text-center mb-12">SELECT YOUR ROLE</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Investigator */}
          <button
            onClick={() => handleRoleSelect('investigator')}
            className="group relative p-8 bg-gray-900 rounded-lg border-2 border-white hover:border-red-600 transition-all duration-300 transform hover:scale-105"
          >
            <h2 className="text-4xl font-bold mb-4 group-hover:text-red-600 transition-colors">INVESTIGATOR</h2>
            <p className="text-gray-400">Question each compartment to find the human</p>
            <div className="absolute inset-0 border-2 border-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          {/* Imposter */}
          <button
            onClick={() => handleRoleSelect('imposter')}
            className="group relative p-8 bg-gray-900 rounded-lg border-2 border-white hover:border-red-600 transition-all duration-300 transform hover:scale-105"
          >
            <h2 className="text-4xl font-bold mb-4 group-hover:text-red-600 transition-colors">IMPOSTER</h2>
            <p className="text-gray-400">Blend in and deceive the investigator</p>
            <div className="absolute inset-0 border-2 border-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
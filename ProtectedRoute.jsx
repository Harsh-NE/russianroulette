import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const roomCode = localStorage.getItem("roomCode");

  if (!roomCode) {
    return <Navigate to="/join" />;
  }

  return children;
};

export default ProtectedRoute;
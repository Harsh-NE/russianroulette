import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import JoinRoom from "./pages/JoinRoom";
import RoleSelect from "./pages/RoleSelect";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import ChatPage from "./pages/ChatPage";
import GuessPage from "./pages/GuessPage";
import ResultPage from "./pages/ResultPage";
import ImposterDashboard from "./pages/ImposterDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Router>

      <div className="min-h-screen bg-black text-white">

        <Routes>

          <Route path="/" element={<LandingPage />} />

          <Route path="/join" element={<JoinRoom />} />

          <Route path="/role" element={<RoleSelect />} />

          <Route
            path="/investigator"
            element={
              <ProtectedRoute>
                <InvestigatorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:slotId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guess_frontend"
            element={
              <ProtectedRoute>
                <GuessPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/imposter"
            element={
              <ProtectedRoute>
                <ImposterDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </div>

    </Router>
  );

}

export default App;
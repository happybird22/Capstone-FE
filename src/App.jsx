// Imports
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import RegisterPage from "./pages/RegistrationPage";
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import NewNote from "./pages/NewNote";
import NewParty from "./pages/NewParty";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/notes/create"
        element={
          <PrivateRoute>
            <NewNote />
          </PrivateRoute>
        }
      />
      <Route
        path="/parties/create"
        element={
          <PrivateRoute>
            <NewParty />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App

// Imports
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import RegisterPage from "./pages/RegistrationPage";
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import NewNote from "./pages/NewNote";
import NewParty from "./pages/NewParty";
import NavBar from "./components/Nav/NavBar";
import SessionNotePage from "./pages/SessionNotePage";
import EditNotePage from "./pages/EditNotePage";
import Footer from "./components/Footer/Footer";

function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/' || location.pathname === '/register';

  return (
    <>
      {!hideNav && <NavBar />}
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
        <Route
          path="/notes/:id"
          element={
            <PrivateRoute>
              <SessionNotePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notes/:id/edit"
          element={
            <PrivateRoute>
              <EditNotePage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App

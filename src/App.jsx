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
import HelpfulHints from "./pages/HelpfulHints";
import PartyBank from "./pages/PartyBank";
import SchedulePage from "./pages/SchedulePage";
import CharactersPage from "./pages/CharactersPage";
import CharacterDetailPage from "./pages/CharacterDetailPage";
import LibraryPage from "./pages/LibraryPage";
import LibraryEntryPage from "./pages/LibraryEntryPage";
import LibraryEntryEditPage from "./pages/LibraryEntryEditPage";
import NotFoundPage from "./pages/NotFoundPage";
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
        <Route
          path="/hints"
          element={
            <PrivateRoute>
              <HelpfulHints />
            </PrivateRoute>
          }
        />
        <Route
          path="/party-bank"
          element={
            <PrivateRoute>
              <PartyBank />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <SchedulePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/characters"
          element={
            <PrivateRoute>
              <CharactersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/characters/:uid"
          element={
            <PrivateRoute>
              <CharacterDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/library/:kind"
          element={
            <PrivateRoute>
              <LibraryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/library/:kind/:entryId"
          element={
            <PrivateRoute>
              <LibraryEntryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/library/:kind/:entryId/edit"
          element={
            <PrivateRoute>
              <LibraryEntryEditPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App

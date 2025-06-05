import NoteList from "../components/NoteList";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { useAuth } from '../context/authContext';
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            const fetchNotes = async () => {
                try {
                    const res = await api.get('/session-notes');
                    setNotes(res.data);
                } catch (err) {
                    console.error('Failed to fetch notes', err);
                }
            };

            fetchNotes();
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div>
            <NavBar />
            <main>
                <h1>Welcome back, Adventurer!</h1>
                <NoteList notes={notes} />
            </main>
        </div>
    );
};

export default Dashboard;
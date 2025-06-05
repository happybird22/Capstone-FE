import NoteList from "../components/NoteList";
import { useState, useEffect } from "react";
import api from '../api/axios';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get('/session-notes');
                setNotes(res.data);
            } catch (err) {
                console.error('Failed to fetch notes', err);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div>
            <h1>My Session Notes</h1>
            <NoteList notes={notes} />
        </div>
    );

};
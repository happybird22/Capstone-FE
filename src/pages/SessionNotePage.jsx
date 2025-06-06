import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import api from "../api/axios";

const SessionNotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [note, setNote] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/session-notes/${id}`);
                setNote(res.data);
            } catch (err) {
                setError('Unable to load note.');
            }
        };

        fetchNote();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await api.delete(`/session-notes/${id}`);
            navigate('/dashboard');
        } catch (err) {
            setError('Unable to delete note at this time.');
        }
    };

    if (error) return <p>{error}</p>;
    if (!note) return <p>Loading note...</p>;

    const canEditOrDelete = user?._id === note.user;

    return (
        <div>
            <h1>{note.campaignTitle}</h1>
            <p>Date: {new Date(note.sessionDate).toLocaleDateString()}</p>

            <div>
                <h2>Notable NPCs:</h2>
                <p>{Array.isArray(note.notableNPCs) ? note.notableNPCs.join(', ') : note.notableNPCs}</p>
            </div>

            <div>
                <h2>Notable Places:</h2>
                <p>{Array.isArray(note.notablePlaces) ? note.notablePlaces.join(', ') : note.notablePlaces}</p>
            </div>

            <div>
                <h2>Memorable Moments:</h2>
                <p>{note.memorableMoments}</p>
            </div>

            <div>
                <h2>Notes:</h2>
                <p>{note.notes}</p>
            </div>

            {canEditOrDelete && (
                <div>
                    <button
                        onClick={() => navigate(`/${note._id}`)}>
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            )}

        </div>
    );
};

export default SessionNotePage;
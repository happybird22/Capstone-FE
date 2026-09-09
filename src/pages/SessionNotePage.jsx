import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getNoteById, deleteNote } from "../services/notes.service";
import styles from './SessionNotePage.module.css';

const SessionNotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [note, setNote] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const data = await getNoteById(id);
                if (!data) {
                    setError('Note not found.');
                    return;
                }
                setNote(data);
            } catch (err) {
                console.error('Failed to load note:', err);
                setError('Unable to load note.');
            }
        };

        fetchNote();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await deleteNote(id);
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to delete note:', err);
            setError('Unable to delete note at this time.');
        }
    };

    if (error) return <p className={styles.status}>{error}</p>;
    if (!note) return <p className={styles.status}>Loading note...</p>;

    const canEditOrDelete = user?._id === note.author;

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>{note.campaignTitle}</h1>
                <p className={styles.date}>Date: {new Date(note.sessionDate).toLocaleDateString()}</p>

                <div className={styles.section}>
                    <h2>Notes</h2>
                    <p>{note.notes}</p>
                </div>

                <div className={styles.section}>
                    <h2>Notable NPCs</h2>
                    <p>{Array.isArray(note.notableNPCs) ? note.notableNPCs.join(', ') : note.notableNPCs}</p>
                </div>

                <div className={styles.section}>
                    <h2>Notable Places</h2>
                    <p>{Array.isArray(note.notablePlaces) ? note.notablePlaces.join(', ') : note.notablePlaces}</p>
                </div>

                <div className={styles.section}>
                    <h2>Memorable Moments</h2>
                    <p>{note.memorableMoments}</p>
                </div>

                {canEditOrDelete && (
                    <div className={styles.actions}>
                        <button
                            className={styles.editButton}
                            onClick={() => navigate(`/notes/${note._id}/edit`)}>
                            Edit
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default SessionNotePage;

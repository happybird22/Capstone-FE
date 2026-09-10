import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getNoteById, deleteNote } from "../services/notes.service";
import { isPartyGM } from "../services/party.service";
import { getLibraryEntries } from "../services/library.service";
import { getPartyCharacters } from "../services/characters.service";
import styles from './SessionNotePage.module.css';

const buildNameMap = (entries) =>
    Object.fromEntries(entries.map((e) => [e.name.trim().toLowerCase(), e]));

const renderTagList = (tags, map, linkFor) => {
    if (!Array.isArray(tags)) return tags;

    return tags.map((tag, i) => {
        const entry = map[tag.trim().toLowerCase()];
        return (
            <span key={i}>
                {i > 0 && ', '}
                {entry ? <Link to={linkFor(entry)}>{tag}</Link> : tag}
            </span>
        );
    });
};

const SessionNotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [note, setNote] = useState(null);
    const [error, setError] = useState('');
    const [npcMap, setNpcMap] = useState({});
    const [placeMap, setPlaceMap] = useState({});
    const [characterMap, setCharacterMap] = useState({});

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

    useEffect(() => {
        if (!note?.partyId) {
            setNpcMap({});
            setPlaceMap({});
            setCharacterMap({});
            return;
        }

        let cancelled = false;

        const loadLibraryLinks = async () => {
            try {
                const isGM = await isPartyGM(note.partyId, user?.uid);
                const [npcs, places, characters] = await Promise.all([
                    getLibraryEntries(note.partyId, 'npcs', { isGM }),
                    getLibraryEntries(note.partyId, 'places', { isGM }),
                    getPartyCharacters(note.partyId),
                ]);

                if (cancelled) return;
                setNpcMap(buildNameMap(npcs));
                setPlaceMap(buildNameMap(places));
                setCharacterMap(buildNameMap(characters));
            } catch (err) {
                console.error('Failed to load library links:', err);
                if (!cancelled) {
                    setNpcMap({});
                    setPlaceMap({});
                    setCharacterMap({});
                }
            }
        };

        loadLibraryLinks();
        return () => { cancelled = true; };
    }, [note?.partyId, user?.uid]);

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
                    <p>{renderTagList(note.notableNPCs, npcMap, (e) => `/library/npcs/${e.id}`)}</p>
                </div>

                <div className={styles.section}>
                    <h2>Notable Places</h2>
                    <p>{renderTagList(note.notablePlaces, placeMap, (e) => `/library/places/${e.id}`)}</p>
                </div>

                <div className={styles.section}>
                    <h2>Notable Characters</h2>
                    <p>{renderTagList(note.notableCharacters, characterMap, (e) => `/characters/${e.id}`)}</p>
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

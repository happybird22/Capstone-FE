import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import { useAuth } from '../context/authContext';
import { LIBRARY_KINDS, isValidLibraryKind } from '../data/libraryKinds';
import { getMyParty } from '../services/party.service';
import { getLibraryEntryById, updateLibraryEntry, deleteLibraryEntry } from '../services/library.service';
import styles from './FormPage.module.css';

const LibraryEntryPage = () => {
    const { kind, entryId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isGM, setIsGM] = useState(null);
    const [entry, setEntry] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.partyId || !isValidLibraryKind(kind)) return;

        const load = async () => {
            try {
                const party = await getMyParty(user);
                setIsGM(!!party && party.gm === user.uid);

                const data = await getLibraryEntryById(user.partyId, kind, entryId);
                if (!data) {
                    setError("That entry doesn't exist, or hasn't been shared with your party yet.");
                } else {
                    setEntry(data);
                }
            } catch (err) {
                console.error('Failed to load library entry:', err);
                setError("That entry doesn't exist, or hasn't been shared with your party yet.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user, kind, entryId]);

    if (!isValidLibraryKind(kind)) return <NotFoundPage />;
    if (loading) return <p className={styles.heading}>Loading...</p>;
    if (error) return <p className={styles.heading}>{error}</p>;
    if (!entry) return <p className={styles.heading}>Not found</p>;

    const { label, hasStatus } = LIBRARY_KINDS[kind];

    const handleToggleStatus = async () => {
        try {
            const updated = { ...entry, status: entry.status === 'resolved' ? 'open' : 'resolved' };
            await updateLibraryEntry(user.partyId, kind, entryId, updated);
            setEntry(updated);
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete this ${label.toLowerCase()}?`)) return;

        try {
            await deleteLibraryEntry(user.partyId, kind, entryId);
            navigate(`/library/${kind}`);
        } catch (err) {
            console.error(`Failed to delete ${label}`, err);
            setError(`Unable to delete this ${label.toLowerCase()} right now.`);
        }
    };

    return (
        <main className={styles.page}>
            <h2 className={styles.heading}>
                {entry.name}
                {hasStatus && ` — ${entry.status === 'resolved' ? 'Resolved' : 'Open'}`}
            </h2>
            <div className={styles.card}>
                <div className={styles.section}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{entry.lore}</p>
                </div>

                {isGM && (
                    <div className={styles.section}>
                        <button onClick={() => navigate(`/library/${kind}/${entryId}/edit`)}>Edit</button>
                        {' '}
                        {hasStatus && (
                            <>
                                <button onClick={handleToggleStatus}>
                                    {entry.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}
                                </button>
                                {' '}
                            </>
                        )}
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                )}

                <Link to={`/library/${kind}`}>Back to {LIBRARY_KINDS[kind].title}</Link>
            </div>
        </main>
    );
};

export default LibraryEntryPage;

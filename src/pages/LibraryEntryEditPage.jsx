import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import LibraryEntryForm from '../components/Forms/LibraryEntryForm';
import { useAuth } from '../context/authContext';
import { LIBRARY_KINDS, isValidLibraryKind } from '../data/libraryKinds';
import { getMyParty } from '../services/party.service';
import { getLibraryEntryById, updateLibraryEntry } from '../services/library.service';
import styles from './FormPage.module.css';

const LibraryEntryEditPage = () => {
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
                setEntry(data);
            } catch (err) {
                console.error('Failed to load library entry:', err);
                setError('Failed to load that entry.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user, kind, entryId]);

    if (!isValidLibraryKind(kind)) return <NotFoundPage />;
    if (loading) return <p className={styles.heading}>Loading...</p>;
    if (error) return <p className={styles.heading}>{error}</p>;
    if (!entry) return <p className={styles.heading}>Entry not found</p>;
    if (!isGM) return <p className={styles.heading}>Only your Game Master can edit this.</p>;

    const { label, hasStatus } = LIBRARY_KINDS[kind];

    const handleUpdate = async (data) => {
        try {
            await updateLibraryEntry(user.partyId, kind, entryId, data);
            navigate(`/library/${kind}/${entryId}`);
        } catch (err) {
            console.error(`Failed to update ${label}`, err);
            setError(`Failed to update this ${label.toLowerCase()}.`);
        }
    };

    return (
        <main className={styles.page}>
            <h2 className={styles.heading}>Edit {label}</h2>
            <div className={styles.card}>
                <LibraryEntryForm onSubmit={handleUpdate} initialData={entry} kindLabel={label} hasStatus={hasStatus} />
            </div>
        </main>
    );
};

export default LibraryEntryEditPage;

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LibraryEntryForm from '../components/Forms/LibraryEntryForm';
import SearchBar from '../components/Search/SearchBar';
import NotFoundPage from './NotFoundPage';
import { useAuth } from '../context/authContext';
import { LIBRARY_KINDS, isValidLibraryKind } from '../data/libraryKinds';
import { getMyParty } from '../services/party.service';
import {
    subscribeToLibraryEntries,
    addLibraryEntry,
    updateLibraryEntry,
    deleteLibraryEntry,
    filterLibraryEntries,
} from '../services/library.service';
import styles from './PartyBank.module.css';

const LibraryPage = () => {
    const { kind } = useParams();
    const { user } = useAuth();
    const [isGM, setIsGM] = useState(null);
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showResolved, setShowResolved] = useState(false);

    useEffect(() => {
        if (!user?.partyId) return;

        getMyParty(user)
            .then((party) => setIsGM(!!party && party.gm === user.uid))
            .catch(() => setIsGM(false));
    }, [user]);

    useEffect(() => {
        if (!user?.partyId || isGM === null) return;

        const unsubscribe = subscribeToLibraryEntries(user.partyId, kind, isGM, setEntries);
        return unsubscribe;
    }, [user?.partyId, kind, isGM]);

    if (!isValidLibraryKind(kind)) return <NotFoundPage />;

    const { label, title, hasStatus } = LIBRARY_KINDS[kind];

    if (!user?.partyId) {
        return (
            <main className={styles.page}>
                <h1 className={styles.heading}>{title}</h1>
                <p className={styles.empty}>
                    You'll need to join or create a party before you can use the {title}.{' '}
                    <Link to="/parties/create">Join or create a party</Link>
                </p>
            </main>
        );
    }

    const handleAdd = async (entry) => {
        try {
            await addLibraryEntry(user.partyId, kind, entry, user.uid);
            setShowForm(false);
        } catch (err) {
            console.error(`Failed to add ${label}`, err);
            alert(`There was an error adding that ${label.toLowerCase()}.`);
        }
    };

    const handleToggleShared = async (entry) => {
        try {
            await updateLibraryEntry(user.partyId, kind, entry.id, { ...entry, shared: !entry.shared });
        } catch (err) {
            console.error('Failed to update sharing', err);
        }
    };

    const handleToggleStatus = async (entry) => {
        try {
            await updateLibraryEntry(user.partyId, kind, entry.id, {
                ...entry,
                status: entry.status === 'resolved' ? 'open' : 'resolved',
            });
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const handleDelete = async (entryId) => {
        if (!window.confirm(`Delete this ${label.toLowerCase()}?`)) return;

        try {
            await deleteLibraryEntry(user.partyId, kind, entryId);
        } catch (err) {
            console.error(`Failed to delete ${label}`, err);
        }
    };

    return (
        <main className={styles.page}>
            <h1 className={styles.heading}>{title}</h1>

            {isGM && (
                <div className={styles.topRow}>
                    <p className={styles.total}>GM-only lore — share entries when you're ready.</p>
                    <button className={styles.addButton} onClick={() => setShowForm((s) => !s)}>
                        {showForm ? 'Close' : `Add ${label}`}
                    </button>
                </div>
            )}

            {showForm && (
                <div className={styles.formWrapper}>
                    <LibraryEntryForm
                        onSubmit={handleAdd}
                        onCancel={() => setShowForm(false)}
                        kindLabel={label}
                        hasStatus={hasStatus}
                    />
                </div>
            )}

            {entries.length > 0 && (
                <div className={styles.topRow}>
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder={`Search ${title}...`} />
                    {hasStatus && (
                        <label>
                            <input
                                type="checkbox"
                                checked={showResolved}
                                onChange={(e) => setShowResolved(e.target.checked)}
                            />
                            {' '}Show resolved
                        </label>
                    )}
                </div>
            )}

            {(() => {
                const visible = filterLibraryEntries(entries, searchTerm).filter(
                    (entry) => !hasStatus || showResolved || entry.status !== 'resolved'
                );

                if (entries.length === 0) return <p className={styles.empty}>Nothing here yet.</p>;
                if (visible.length === 0) return <p className={styles.empty}>No matches.</p>;

                return (
                    <div className={styles.grid}>
                        {visible.map((entry) => (
                            <div key={entry.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h3>{entry.name}</h3>
                                    {entry.shared && <span className={styles.magicBadge}>Shared</span>}
                                    {hasStatus && (
                                        <span className={styles.magicBadge}>
                                            {entry.status === 'resolved' ? 'Resolved' : 'Open'}
                                        </span>
                                    )}
                                </div>
                                <p className={styles.desc}>
                                    <Link to={`/library/${kind}/${entry.id}`}>View lore</Link>
                                </p>
                                {isGM && (
                                    <>
                                        <button className={styles.editButton} onClick={() => handleToggleShared(entry)}>
                                            {entry.shared ? 'Unshare' : 'Share with Party'}
                                        </button>
                                        {hasStatus && (
                                            <button className={styles.editButton} onClick={() => handleToggleStatus(entry)}>
                                                {entry.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}
                                            </button>
                                        )}
                                        <Link to={`/library/${kind}/${entry.id}/edit`} className={styles.editButton}>
                                            Edit
                                        </Link>
                                        <button className={styles.removeButton} onClick={() => handleDelete(entry.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                );
            })()}
        </main>
    );
};

export default LibraryPage;

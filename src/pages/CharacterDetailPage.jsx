import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import CharacterForm from '../components/Forms/CharacterForm';
import { useAuth } from '../context/authContext';
import { getCharacterById, saveMyCharacter } from '../services/characters.service';
import { firestore } from '../config/firebase.config';
import styles from './FormPage.module.css';

const CharacterDetailPage = () => {
    const { uid } = useParams();
    const { user } = useAuth();
    const [character, setCharacter] = useState(null);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!user?.partyId) return;

        const load = async () => {
            try {
                const data = await getCharacterById(user.partyId, uid);
                setCharacter(data);

                const userSnap = await getDoc(doc(firestore, 'users', uid));
                setUsername(userSnap.exists() ? userSnap.data().username : '');
            } catch (err) {
                console.error('Failed to load character:', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user?.partyId, uid]);

    if (!user?.partyId) return null;
    if (loading) return <p className={styles.heading}>Loading...</p>;

    const isMine = user.uid === uid;

    const handleSave = async (data) => {
        try {
            await saveMyCharacter(user.partyId, uid, data);
            setCharacter((prev) => ({ ...prev, ...data }));
            setEditing(false);
        } catch (err) {
            console.error('Failed to save character', err);
            alert('There was an error saving your character.');
        }
    };

    if (isMine && editing) {
        return (
            <main className={styles.page}>
                <h2 className={styles.heading}>Edit Character</h2>
                <div className={styles.card}>
                    <CharacterForm
                        initialData={character || {}}
                        onSubmit={handleSave}
                        onCancel={() => setEditing(false)}
                    />
                </div>
            </main>
        );
    }

    if (!character) {
        return (
            <main className={styles.page}>
                <h2 className={styles.heading}>{username || 'This character'}</h2>
                <div className={styles.card}>
                    <p>No summary written yet.</p>
                    {isMine && <button onClick={() => setEditing(true)}>Write Summary</button>}
                    <Link to="/characters">Back to Characters</Link>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <h2 className={styles.heading}>{character.name}</h2>
            <div className={styles.card}>
                <div className={styles.section}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{character.description}</p>
                </div>

                {isMine && (
                    <div className={styles.section}>
                        <button onClick={() => setEditing(true)}>Edit</button>
                    </div>
                )}

                <Link to="/characters">Back to Characters</Link>
            </div>
        </main>
    );
};

export default CharacterDetailPage;

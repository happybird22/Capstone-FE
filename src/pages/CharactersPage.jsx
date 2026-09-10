import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CharacterForm from '../components/Forms/CharacterForm';
import { useAuth } from '../context/authContext';
import { getPartyMembers } from '../services/party.service';
import { subscribeToPartyCharacters, saveMyCharacter } from '../services/characters.service';
import styles from './PartyBank.module.css';

const CharactersPage = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!user?.partyId) return;
        getPartyMembers(user.partyId).then(setMembers).catch(() => setMembers([]));
    }, [user?.partyId]);

    useEffect(() => {
        if (!user?.partyId) {
            setCharacters([]);
            return;
        }

        const unsubscribe = subscribeToPartyCharacters(user.partyId, setCharacters);
        return unsubscribe;
    }, [user?.partyId]);

    if (!user?.partyId) {
        return (
            <main className={styles.page}>
                <h1 className={styles.heading}>Characters</h1>
                <p className={styles.empty}>
                    You'll need to join or create a campaign before you can use Characters.{' '}
                    <Link to="/parties/create">Join or create a campaign</Link>
                </p>
            </main>
        );
    }

    const characterByUid = Object.fromEntries(characters.map((c) => [c.id, c]));

    const handleSave = async (data) => {
        try {
            await saveMyCharacter(user.partyId, user.uid, data);
            setEditing(false);
        } catch (err) {
            console.error('Failed to save character', err);
            alert('There was an error saving your character.');
        }
    };

    return (
        <main className={styles.page}>
            <h1 className={styles.heading}>Characters</h1>
            <p className={styles.notice}>Your party's characters, at a glance.</p>

            <div className={styles.grid}>
                {members.map((member) => {
                    const character = characterByUid[member.uid];
                    const isMine = member.uid === user.uid;

                    return (
                        <div key={member.uid} className={styles.card}>
                            {isMine && editing ? (
                                <CharacterForm
                                    initialData={character || {}}
                                    onSubmit={handleSave}
                                    onCancel={() => setEditing(false)}
                                />
                            ) : (
                                <>
                                    <div className={styles.cardHeader}>
                                        <h3>{character?.name || member.username}</h3>
                                    </div>
                                    <p className={styles.desc}>
                                        {character ? (
                                            <Link to={`/characters/${member.uid}`}>View character</Link>
                                        ) : isMine ? (
                                            'No summary yet — write one.'
                                        ) : (
                                            'No summary yet.'
                                        )}
                                    </p>
                                    {isMine && (
                                        <button className={styles.editButton} onClick={() => setEditing(true)}>
                                            {character ? 'Edit' : 'Write Summary'}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default CharactersPage;

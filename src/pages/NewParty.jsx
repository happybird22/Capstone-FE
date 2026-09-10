import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createParty, joinParty, getMyParty } from "../services/party.service";
import PartyForm from "../components/Forms/PartyForm";
import JoinPartyForm from "../components/Forms/JoinPartyForm";
import AppPromo from "../components/AppPromo/AppPromo";
import { useAuth } from "../context/authContext";
import styles from './PartyBank.module.css';

function NewParty() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [existingParty, setExistingParty] = useState(null);
    const [loadingParty, setLoadingParty] = useState(true);
    const [activeCard, setActiveCard] = useState(null);
    const [createdInviteCode, setCreatedInviteCode] = useState('');
    const [created, setCreated] = useState(false);

    useEffect(() => {
        if (!user?.partyId) {
            setExistingParty(null);
            setLoadingParty(false);
            return;
        }

        getMyParty(user)
            .then(setExistingParty)
            .catch(() => setExistingParty(null))
            .finally(() => setLoadingParty(false));
    }, [user]);

    const handleCreateParty = async (formData) => {
        try {
            const { inviteCode } = await createParty({ name: formData.name, gmUid: user.uid });
            setCreatedInviteCode(inviteCode);
            setCreated(true);
        } catch (err) {
            alert(err.message || 'Could not create campaign');
        }
    };

    const handleJoinParty = async (inviteCode) => {
        try {
            const res = await joinParty({ inviteCode, uid: user.uid });
            navigate('/dashboard');
            return { message: res.message || 'Successfully joined the campaign!' };
        } catch (err) {
            return { message: err.message || 'Failed to join campaign' };
        }
    };

    if (loadingParty) return null;

    return (
        <main className={styles.page}>
            <h1 className={styles.heading}>Choose Your Campaign</h1>

            <AppPromo message="Don't have an invite code? If you're still looking for a group, find one in the Dungeons Not Dating app." />

            <div className={styles.grid}>
                {existingParty && (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>{existingParty.name}</h3>
                        </div>
                        <p className={styles.desc}>Jump back into your ongoing campaign.</p>
                        <button className={styles.addButton} onClick={() => navigate('/dashboard')}>
                            Continue Campaign
                        </button>
                    </div>
                )}

                {user.role === 'gm' && (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Create a new campaign as a Game Master</h3>
                        </div>
                        <p className={styles.desc}>
                            Track NPCs, Notable Places, Religions, Factions and all important world building
                            lore in one place. Invite your players and share notes and lore with them as you
                            go. Track party inventory, quests and more.
                        </p>
                        {activeCard === 'create' ? (
                            created ? (
                                <div className={styles.formWrapper}>
                                    <p><strong>Invite Code:</strong> {createdInviteCode}</p>
                                    <p>Share this code with all players you want to join this campaign!</p>
                                    <button className={styles.addButton} onClick={() => navigate('/dashboard')}>
                                        Go to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.formWrapper}>
                                    <PartyForm onSubmit={handleCreateParty} />
                                </div>
                            )
                        ) : (
                            <button className={styles.addButton} onClick={() => setActiveCard('create')}>
                                Create Campaign
                            </button>
                        )}
                    </div>
                )}

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>Join a Campaign as a Player</h3>
                    </div>
                    <p className={styles.desc}>
                        Ask your Game Master for an invite code. Take session notes to share with your
                        party, find helpful hints, track inventory and more.
                    </p>
                    {activeCard === 'join' ? (
                        <div className={styles.formWrapper}>
                            <JoinPartyForm onJoin={handleJoinParty} />
                        </div>
                    ) : (
                        <button className={styles.addButton} onClick={() => setActiveCard('join')}>
                            Join Campaign
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

export default NewParty;

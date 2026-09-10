import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createParty, joinParty } from "../services/party.service";
import PartyForm from "../components/Forms/PartyForm";
import JoinPartyForm from "../components/Forms/JoinPartyForm";
import AppPromo from "../components/AppPromo/AppPromo";
import { useAuth } from "../context/authContext";
import styles from './FormPage.module.css';

function NewParty() {
    const [createdInviteCode, setCreatedInviteCode] = useState('');
    const [created, setCreated] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreateParty = async (formData) => {
        try {
            const { inviteCode } = await createParty({ name: formData.name, gmUid: user.uid });
            setCreatedInviteCode(inviteCode);
            setCreated(true);
        } catch (err) {
            alert(err.message || 'Could not create party');
        }
    };

    const handleJoinParty = async (inviteCode) => {
        try {
            const res = await joinParty({ inviteCode, uid: user.uid });
            navigate('/dashboard');
            return { message: res.message || 'Successfully joined the party!' };
        } catch (err) {
            return { message: err.message || 'Failed to join Party' };
        }
    };

    return (
        <main className={styles.page}>
            <h1 className={styles.heading}>Party Portal</h1>

            <AppPromo message="Don't have an invite code? If you're still looking for a group, find one in the Dungeons Not Dating app." />

            <div className={styles.card}>
                {user.role === 'gm' && (
                    <section className={styles.section}>
                        {created ? (
                            <div className={styles.inviteCode}>
                                <p><strong>Invite Code:</strong> {createdInviteCode}</p>
                                <p>Share this code with all players you want to join this party!</p>
                                <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
                            </div>
                        ) : (
                            <PartyForm onSubmit={handleCreateParty} />
                        )}
                    </section>
                )}

                {user.role === 'gm' && <hr className={styles.divider} />}

                <section className={styles.section}>
                    <h2>Join a Party</h2>
                    <JoinPartyForm onJoin={handleJoinParty} />
                </section>
            </div>
        </main>
    );
}

export default NewParty;

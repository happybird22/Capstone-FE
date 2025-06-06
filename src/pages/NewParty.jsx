import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PartyForm from "../components/Forms/PartyForm";
import JoinPartyForm from "../components/Forms/JoinPartyForm";
import { useAuth } from "../context/authContext";

function NewParty() {
    const [inviteCode, setInviteCode] = useState('');
    const [createdInviteCode, setCreatedInviteCode] = useState('');
    const [created, setCreated] = useState('');
    const [joinMessage, setJoinMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreateParty = async (formData) => {
        try {
            const res = await api.post(
                '/api/parties/create',
                { name: formData.name },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            setCreatedInviteCode(res.data.inviteCode);
            setCreated(true);
        } catch (err) {
            alert(err.res?.data?.message || 'Could not create party');
        }
    };

    const handleJoinParty = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
                '/api/parties/join',
                { inviteCode },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            setJoinMessage('Successfully joined the party!');
            navigate('/dashboard');
        } catch (err) {
            setJoinMessage(err.res?.data?.message || "Failed to join Party");
        }
    };

    return (
        <div>
            <h1>Party Portal</h1>

            {user.role === 'gm' && (
                <section>
                    <h2>Create a New Party</h2>
                    {created ? (
                <div>
                    <p><strong>Invite Code:</strong>{inviteCode}</p>
                    <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
                </div>
            ) : (
                <PartyForm onSubmit={handleCreateParty} />
            )}
            </section>
            )}

            <section>
                <h2>Join a Party</h2>
                <JoinPartyForm onJoin={handleJoinParty} />
            </section>
        </div>
    );
}

export default NewParty;
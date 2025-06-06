import React, { useState } from "react";

function JoinPartyForm({ onJoin }) {
    const [inviteCode, setInviteCode] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await onJoin(inviteCode.toUpperCase());
        setFeedback(result.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Invite Code:
                <input 
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
                />
            </label>
            <button type="submit">Join Party</button>
            {feedback && <p>{feedback}</p>}
        </form>
    );
}

export default JoinPartyForm;
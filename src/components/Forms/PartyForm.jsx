import { useState } from "react";

function PartyForm({ onSubmit }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New Party</h2>

            <label>Party Name:
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                 />
            </label>

            <p>Once created, share the invite code with your players so they can join.</p>

            <button type="submit">Create Party</button>
        </form>
    );
}

export default PartyForm;
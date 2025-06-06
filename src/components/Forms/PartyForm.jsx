import { useState } from "react";

function PartyForm({ onSubmit, users = [] }) {
    const [name, setName] = useState('');
    const [members, setMembers] = useState([]);

    const handleMemberChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) selected.push(options[i].value);
        }
        setMembers(selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, members });
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

            <label>Members (optional):
                <select multiple value={members} onChange={handleMemberChange}>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </label>

            <button type="submit">Create Party</button>
        </form>
    );
}

export default PartyForm;
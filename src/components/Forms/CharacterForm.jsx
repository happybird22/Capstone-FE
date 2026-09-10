import { useState } from 'react';

function CharacterForm({ onSubmit, onCancel, initialData = {} }) {
    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Character Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>

            <label>Description:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </label>

            <div>
                <button type="submit">Save Character</button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>Cancel</button>
                )}
            </div>
        </form>
    );
}

export default CharacterForm;

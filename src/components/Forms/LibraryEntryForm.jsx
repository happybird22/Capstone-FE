import { useState } from 'react';

function LibraryEntryForm({ onSubmit, onCancel, initialData = {}, kindLabel = 'Entry', hasStatus = false }) {
    const isEditing = !!initialData.id;
    const [name, setName] = useState(initialData.name || '');
    const [lore, setLore] = useState(initialData.lore || '');
    const [shared, setShared] = useState(!!initialData.shared);
    const [status, setStatus] = useState(initialData.status || 'open');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, lore, shared, ...(hasStatus ? { status } : {}) });

        if (!isEditing) {
            setName('');
            setLore('');
            setShared(false);
            setStatus('open');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>

            <label>Lore:
                <textarea value={lore} onChange={(e) => setLore(e.target.value)}></textarea>
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={shared}
                    onChange={(e) => setShared(e.target.checked)}
                />
                {' '}Share with Party
            </label>

            {hasStatus && (
                <label>Status:
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="open">Open</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </label>
            )}

            <div>
                <button type="submit">{isEditing ? 'Save Changes' : `Add ${kindLabel}`}</button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>Cancel</button>
                )}
            </div>
        </form>
    );
}

export default LibraryEntryForm;

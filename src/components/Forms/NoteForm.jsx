import { useState } from "react";

function NoteForm({ onSubmit, initialData = {}, users = [], campaignOptions = [] }) {
    const [campaignTitle, setCampaignTitle] = useState(initialData.campaignTitle || '');
    const [sessionDate, setSessionDate] = useState(initialData.sessionDate ? initialData.sessionDate.substring(0, 10) : '');
    const [notes, setNotes] = useState(initialData.notes || '');
    const [memorableMoments, setMemorableMoments] = useState(initialData.memorableMoments || '');
    const [notableNPCs, setNotableNPCs] = useState(initialData.notableNPCs || ['']);
    const [notablePlaces, setNotablePlaces] = useState(initialData.notablePlaces || ['']);
    const [notableCharacters, setNotableCharacters] = useState(initialData.notableCharacters || ['']);
    const [visibility, setVisibility] = useState(initialData.visibility || 'private');
    const [sharedWith, setSharedWith] = useState(initialData.sharedWith || []);

    const handleNPCChange = (index, value) => {
        const newNPCs = [...notableNPCs];
        newNPCs[index] = value;
        setNotableNPCs(newNPCs);
    };

    const addNPC = () => setNotableNPCs([...notableNPCs, '']);
    const removeNPC = (index) => setNotableNPCs(notableNPCs.filter((_, i) => i !== index));

    const handlePlaceChange = (index, value) => {
        const newPlaces = [...notablePlaces];
        newPlaces[index] = value;
        setNotablePlaces(newPlaces);
    };

    const addPlace = () => setNotablePlaces([...notablePlaces, '']);
    const removePlace = (index) => setNotablePlaces(notablePlaces.filter((_, i) => i !== index));

    const handleCharacterChange = (index, value) => {
        const newCharacters = [...notableCharacters];
        newCharacters[index] = value;
        setNotableCharacters(newCharacters);
    };

    const addCharacter = () => setNotableCharacters([...notableCharacters, '']);
    const removeCharacter = (index) => setNotableCharacters(notableCharacters.filter((_, i) => i !== index));

    const handleSharedWithChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) selected.push(options[i].value);
        }
        setSharedWith(selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            campaignTitle,
            sessionDate,
            notes,
            memorableMoments,
            notableNPCs: notableNPCs.filter(npc => npc.trim() !== ''),
            notablePlaces: notablePlaces.filter(place => place.trim() !== ''),
            notableCharacters: notableCharacters.filter(character => character.trim() !== ''),
            visibility,
            sharedWith,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Campaign Title:
                <select
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                >
                    <option value="">-- Type new or select existing --</option>
                    {campaignOptions.map((title) => (
                        <option key={title} value={title}>
                            {title}
                        </option>
                    ))}
                </select>

                <input type="text"
                    placeholder="Or type new campaign title"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    required
                />
            </label>

            <label>Session Date:
                <input type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)} required />
            </label>

            <label>Notes:
                <textarea value={notes} onChange={e => setNotes(e.target.value)} required></textarea>
            </label>

            <label>Memorable Moments:
                <textarea value={memorableMoments} onChange={e => setMemorableMoments(e.target.value)}></textarea>
            </label>

            <fieldset>
                <legend>Notable NPCs:</legend>
                {notableNPCs.map((npc, i) => (
                    <div key={i}>
                        <input type="text" value={npc} onChange={e => handleNPCChange(i, e.target.value)} />
                        <button type="button" onClick={() => removeNPC(i)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addNPC}>Add NPC</button>
            </fieldset>

            <fieldset>
                <legend>Notable Places:</legend>
                {notablePlaces.map((place, i) => (
                    <div key={i}>
                        <input type="text" value={place} onChange={e => handlePlaceChange(i, e.target.value)} />
                        <button type="button" onClick={() => removePlace(i)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addPlace}>Add Place</button>
            </fieldset>

            <fieldset>
                <legend>Notable Characters:</legend>
                {notableCharacters.map((character, i) => (
                    <div key={i}>
                        <input type="text" value={character} onChange={e => handleCharacterChange(i, e.target.value)} />
                        <button type="button" onClick={() => removeCharacter(i)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addCharacter}>Add Character</button>
            </fieldset>

            <label>Visibility:
                <select value={visibility} onChange={e => setVisibility(e.target.value)}>
                    <option value="private">Private</option>
                    <option value="all">Whole Party</option>
                    <option value="one">Someone specific</option>
                </select>
            </label>

            <label>Shared With:
                <select multiple value={sharedWith} onChange={handleSharedWithChange}>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.username}</option>
                    ))}
                </select>
            </label>

            <button type="submit">Save Note</button>
        </form>
    );
}

export default NoteForm;
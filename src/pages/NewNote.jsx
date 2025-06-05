import React from "react";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { useAuth } from "../context/authContext";
import axios from "axios";

function NewNote() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleNoteSubmit = async (noteData) => {
        try {
            const res = await axios.post('/api/notes', {
                ...noteData,
                author: user._id,
                partyId: user.partyId,
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to create note:', err);
            alert('There was an error creating your note.');
        }
    };

    return (
        <div>
            <h2>Create a New Session Note</h2>
            <NoteForm onSubmit={handleNoteSubmit} user={[]} />
        </div>
    );
}

export default NewNote;
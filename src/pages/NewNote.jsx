import { useNavigate } from "react-router-dom";
import NoteForm from "../components/Forms/NoteForm";
import { useAuth } from "../context/authContext";
import api from "../api/axios";
import { useState, useEffect } from "react";

function NewNote() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await api.get('/session-notes/dashboard');
                const campaignSet = new Set();

                res.data.forEach((note) => {
                    if (note.campaignTitle) campaignSet.add(note.campaignTitle);
                });

                setCampaigns(Array.from(campaignSet));
            } catch (err) {
                console.error('Failed to load campaign titles', err);
            }
        };

        fetchCampaigns();
    }, []);

    const handleNoteSubmit = async (noteData) => {
        try {
            await api.post('/session-notes/create', {
                ...noteData,
                author: user._id,
                partyId: user.partyId,
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
            <NoteForm onSubmit={handleNoteSubmit} user={user} campaignOptions={campaigns}/>
        </div>
    );
}

export default NewNote;
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/Forms/NoteForm";
import { useAuth } from "../context/authContext";
import { getDashboardNotes, createNote } from "../services/notes.service";
import { getPartyMembers } from "../services/party.service";
import { useState, useEffect } from "react";
import styles from './FormPage.module.css';

function NewNote() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [partyMembers, setPartyMembers] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchCampaigns = async () => {
            try {
                const notes = await getDashboardNotes({ uid: user.uid });
                const campaignSet = new Set();

                notes.forEach((note) => {
                    if (note.campaignTitle) campaignSet.add(note.campaignTitle);
                });

                setCampaigns(Array.from(campaignSet));
            } catch (err) {
                console.error('Failed to load campaign titles', err);
            }
        };

        const fetchPartyMembers = async () => {
            try {
                const members = await getPartyMembers(user.partyId);
                setPartyMembers(members);
            } catch (err) {
                console.error('Failed to load party members', err);
            }
        };

        fetchCampaigns();
        fetchPartyMembers();
    }, [user]);

    const handleNoteSubmit = async (noteData) => {
        try {
            await createNote(noteData, user);
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to create note:', err);
            alert('There was an error creating your note.');
        }
    };

    return (
        <main className={styles.page}>
            <h2 className={styles.heading}>Create a New Session Note</h2>
            <div className={styles.card}>
                <NoteForm onSubmit={handleNoteSubmit} user={user} campaignOptions={campaigns} users={partyMembers}/>
            </div>
        </main>
    );
}

export default NewNote;

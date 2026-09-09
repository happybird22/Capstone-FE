import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getDashboardNotes, getNoteById, updateNote } from "../services/notes.service";
import { getPartyMembers } from "../services/party.service";
import NoteForm from "../components/Forms/NoteForm";
import styles from './FormPage.module.css';

const EditNotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [note, setNote] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState([]);
    const [partyMembers, setPartyMembers] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchNote = async () => {
            try {
                const data = await getNoteById(id);
                setNote(data);
            } catch (err) {
                console.error('Failed to load session note:', err);
                setError('Failed to load session note.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCampaigns = async () => {
            try {
                const notes = await getDashboardNotes({ uid: user.uid });
                const campaignSet = new Set();
                notes.forEach((n) => {
                    if (n.campaignTitle) campaignSet.add(n.campaignTitle);
                });
                setCampaigns(Array.from(campaignSet));
            } catch (err) {
                console.error('Failed to load campaign titles:', err);
            }
        };

        const fetchPartyMembers = async () => {
            try {
                const members = await getPartyMembers(user.partyId);
                setPartyMembers(members);
            } catch {
                setPartyMembers([]);
            }
        };

        fetchNote();
        fetchCampaigns();
        fetchPartyMembers();
    }, [id, user]);

    const handleUpdate = async (updatedData) => {
        try {
            await updateNote(id, updatedData, user);
            navigate(`/notes/${id}`);
        } catch (err) {
            setError(err.message || 'Failed to update note.');
        }
    };

    if (loading) return <p className={styles.heading}>Loading...</p>
    if (error) return <p className={styles.heading}>{error}</p>
    if (!note) return <p className={styles.heading}>Note not found</p>

    return (
        <main className={styles.page}>
            <h2 className={styles.heading}>Edit Session Note</h2>
            <div className={styles.card}>
                <NoteForm
                    onSubmit={handleUpdate}
                    initialData={note}
                    campaignOptions={campaigns}
                    users={partyMembers}
                />
            </div>
        </main>
    );
};

export default EditNotePage;

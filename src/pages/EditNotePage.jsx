import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import NoteForm from "../components/Forms/NoteForm";

const EditNotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState([]);
    const [partyMembers, setPartyMembers] = useState([]);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/session-notes/${id}`);
                setNote(res.data);
            } catch (err) {
                setError('Failed to load session note.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCampaigns = async () => {
            try {
                const res = await api/get('/session-notes/dashboard');
                const campaignSet = new Set();
                res.data.forEach((n) => {
                    if (n.campaignTitle) campaignSet.add(n.campaignTitle);
                });
                setCampaigns(Array.from(campaignSet));
            } catch {

            }
        };

        const fetchPartyMembers = async () => {
            try {
                const res = await api.get('/parties/mine');
                setPartyMembers(res.data);
            } catch {
                setPartyMembers([]);
            }
        };

        fetchNote();
        fetchCampaigns();
        fetchPartyMembers();
    }, [id]);

    const handleUpdate = async (updatedData) => {
        try {
            await api.put(`/session-notes/${id}`, updatedData);
            navigate(`/notes/${id}`);
        } catch (err) {
            setError('Failed to update note.');
        }
    };

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>
    if (!note) return <p>Note not found</p>

    return (
        <div>
            <h2>Edit Session Note</h2>
            <NoteForm
                onSubmit={handleUpdate}
                initialData={note}
                campaignOptions={campaigns}
                users={partyMembers}
            />
        </div>
    );
};

export default EditNotePage;
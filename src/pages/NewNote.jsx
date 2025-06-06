import { useNavigate } from "react-router-dom";
import NoteForm from "../components/Forms/NoteForm";
import { useAuth } from "../context/authContext";
import api from "../api/axios";

function NewNote() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleNoteSubmit = async (noteData) => {
        try {
            await api.post('/api/session-note/create', {
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
            <NoteForm onSubmit={handleNoteSubmit} user={user} />
        </div>
    );
}

export default NewNote;
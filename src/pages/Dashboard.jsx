import NoteList from "../components/NoteList";
import NavBar from "../components/Nav/NavBar";
import SearchBar from "../components/Search/SearchBar";
import { useState, useEffect } from "react";
import { useAuth } from '../context/authContext';
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [campaign, setCampaign] = useState('');
    const [partyId, setPartyId] = useState(user?.partyId || '');
    const [parties, setParties] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            const fetchNotes = async () => {
                try {
                    const params = {};

                    if (searchTerm) {
                        params.npc = searchTerm;
                        params.place = searchTerm;
                        params.date = searchTerm;
                    }
                    if (campaign) {
                        params.campaign = campaign;
                    }
                    if (user?.role === 'gm' && partyId) {
                        params.partyId = partyId;
                    }

                    const res = await api.get('/session-notes', { params });
                    const notes = res.data;

                    setNotes(notes);

                    const campaignSet = new Set();
                    notes.forEach((note) => {
                        if (note.campaignTitle) campaignSet.add(note.campaignTitle);
                    });
                    setCampaigns(Array.from(campaignSet));
                } catch (err) {
                    console.error('Failed to fetch notes', err);
                }
            };

            fetchNotes();
        }
    }, [user, searchTerm, navigate]);

    const fetchParties = async () => {
        if (user?.role !== 'gm') return;

        try {
            const res = await api.get('parties/mine');
            setParties(res.data);
        } catch (err) {
            console.error('Failed to fetch parties', err);
        }
    };

    useEffect(() => {
        if (user?.role === 'gm') {
            fetchParties();
        }
    }, [user]);

    if (!user) return null;

    return (
        <div>
            <main className={styles.page}>
                <div className={styles.topRow}>
                    <h1 className={styles.heading}>Welcome back, Adventurer!</h1>
                    <div className={styles.searchWrapper}>
                        <SearchBar value={searchTerm} onChange={setSearchTerm} />

                        <select value={campaign} onChange={(e) => setCampaign(e.target.value)}>
                            <option value="">All Campaigns</option>
                            {campaigns.map((title) => {
                                <option key={title} value={title}>
                                    {title}
                                </option>
                            })}
                        </select>

                        {user?.role === 'gm' && (
                            <select value={partyId} onChange={(e) => setPartyId(e.target.value)}>
                                <option value="">All Parties</option>
                                {parties.map((party) => {
                                    <option key={party._id} value={party._id}>
                                        {party.name}
                                    </option>
                                })}
                            </select>
                        )}
                    </div>
                </div>
                <NoteList notes={notes} />
            </main>
        </div>
    );
};

export default Dashboard;
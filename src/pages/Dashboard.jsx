import NoteList from "../components/NoteList";
import SearchBar from "../components/Search/SearchBar";
import AppPromo from "../components/AppPromo/AppPromo";
import NextSessionCard from "../components/NextSessionCard";
import { useState, useEffect } from "react";
import { useAuth } from '../context/authContext';
import { useNavigate } from "react-router-dom";
import { getDashboardNotes, searchNotes } from '../services/notes.service';
import { getMyParty } from '../services/party.service';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [allNotes, setAllNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [campaign, setCampaign] = useState('');
    const [partyId, setPartyId] = useState(user?.partyId || '');
    const [parties, setParties] = useState([]);
    const [lastVisit, setLastVisit] = useState(undefined);

    useEffect(() => {
        if (!user?.uid) return;

        const key = `sessionJournal:lastVisit:${user.uid}`;
        const stored = localStorage.getItem(key);
        setLastVisit(stored ? Number(stored) : null);
        localStorage.setItem(key, Date.now().toString());
    }, [user?.uid]);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchNotes = async () => {
            try {
                const targetPartyId = user.role === 'gm' && partyId ? partyId : (user.partyId || undefined);
                const notes = await getDashboardNotes({ uid: user.uid, partyId: targetPartyId });

                setAllNotes(notes);

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
    }, [user, partyId, navigate]);

    useEffect(() => {
        const fetchParties = async () => {
            if (user?.role !== 'gm') return;

            try {
                const myParty = await getMyParty(user);
                setParties(myParty ? [myParty] : []);
            } catch (err) {
                console.error('Failed to fetch parties', err);
            }
        };

        fetchParties();
    }, [user]);

    if (!user) return null;

    const notes = searchNotes(allNotes, { search: searchTerm, campaign });

    const newSinceLastVisit = lastVisit
        ? allNotes.filter(
              (note) => note.author !== user.uid && (note.createdAt?.toMillis?.() ?? 0) > lastVisit
          ).length
        : 0;

    return (
        <div>
            <main className={styles.page}>
                <div className={styles.topRow}>
                    <h1 className={styles.heading}>Welcome back, Adventurer!</h1>
                    <div className={`${styles.searchWrapper} gradientBorder`}>
                        <SearchBar value={searchTerm} onChange={setSearchTerm} />

                        <select value={campaign} onChange={(e) => setCampaign(e.target.value)}>
                            <option value="">All Campaigns</option>
                            {campaigns.map((title) => (
                                <option key={title} value={title}>
                                    {title}
                                </option>
                            ))}
                        </select>

                        {user?.role === 'gm' && (
                            <select value={partyId} onChange={(e) => setPartyId(e.target.value)}>
                                <option value="">All Parties</option>
                                {parties.map((party) => (
                                    <option key={party._id} value={party._id}>
                                        {party.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
                {user?.partyId && <NextSessionCard partyId={user.partyId} uid={user.uid} />}

                {allNotes.length === 0 && (
                    <AppPromo message="New here? Get real-time alerts for new notes and party activity on your phone with the Dungeons Not Dating app." />
                )}

                {newSinceLastVisit > 0 && (
                    <AppPromo
                        message={`${newSinceLastVisit} new note${newSinceLastVisit > 1 ? 's' : ''} from your party since your last visit. Want that pushed to your phone instantly?`}
                    />
                )}

                <NoteList notes={notes} />
            </main>
        </div>
    );
};

export default Dashboard;

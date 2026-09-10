import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ScheduleSessionForm from '../components/Forms/ScheduleSessionForm';
import RsvpControls from '../components/RsvpControls';
import { useAuth } from '../context/authContext';
import { isPartyGM, getPartyMembers } from '../services/party.service';
import {
    subscribeToScheduledSessions,
    createScheduledSession,
    updateScheduledSession,
    deleteScheduledSession,
    splitUpcomingPast,
} from '../services/schedule.service';
import styles from './PartyBank.module.css';

const SchedulePage = () => {
    const { user } = useAuth();
    const [isGM, setIsGM] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (!user?.partyId) return;

        isPartyGM(user.partyId, user.uid).then(setIsGM).catch(() => setIsGM(false));
        getPartyMembers(user.partyId).then(setMembers).catch(() => setMembers([]));
    }, [user?.partyId, user?.uid]);

    useEffect(() => {
        if (!user?.partyId) {
            setSessions([]);
            return;
        }

        const unsubscribe = subscribeToScheduledSessions(user.partyId, setSessions);
        return unsubscribe;
    }, [user?.partyId]);

    if (!user?.partyId) {
        return (
            <main className={styles.page}>
                <h1 className={styles.heading}>Schedule</h1>
                <p className={styles.empty}>
                    You'll need to join or create a party before you can use the Schedule.{' '}
                    <Link to="/parties/create">Join or create a party</Link>
                </p>
            </main>
        );
    }

    const { upcoming, past } = splitUpcomingPast(sessions);
    const [hero, ...restUpcoming] = upcoming;

    const handleCreate = async (data) => {
        try {
            await createScheduledSession({ partyId: user.partyId, ...data, uid: user.uid });
            setShowForm(false);
        } catch (err) {
            console.error('Failed to schedule session', err);
            alert('There was an error scheduling that session.');
        }
    };

    const handleUpdate = async (sessionId, data) => {
        try {
            await updateScheduledSession(sessionId, data);
            setEditingId(null);
        } catch (err) {
            console.error('Failed to update session', err);
            alert('There was an error saving that session.');
        }
    };

    const handleDelete = async (sessionId) => {
        if (!window.confirm('Delete this scheduled session?')) return;

        try {
            await deleteScheduledSession(sessionId);
        } catch (err) {
            console.error('Failed to delete session', err);
        }
    };

    const renderSessionCard = (session, { readOnly = false } = {}) => (
        <div key={session.id} className={styles.card}>
            {editingId === session.id ? (
                <ScheduleSessionForm
                    key={session.id}
                    initialData={session}
                    onSubmit={(data) => handleUpdate(session.id, data)}
                    onCancel={() => setEditingId(null)}
                />
            ) : (
                <>
                    <div className={styles.cardHeader}>
                        <h3>{format(session.dateTime.toDate(), 'PPPp')}</h3>
                    </div>
                    {session.note && <p className={styles.desc}>{session.note}</p>}
                    <RsvpControls sessionId={session.id} uid={user.uid} members={members} readOnly={readOnly} />
                    {isGM && !readOnly && (
                        <>
                            <button
                                className={styles.editButton}
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(session.id);
                                }}
                            >
                                Edit
                            </button>
                            <button className={styles.removeButton} onClick={() => handleDelete(session.id)}>
                                Delete
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );

    return (
        <main className={styles.page}>
            <h1 className={styles.heading}>Schedule</h1>

            {isGM && (
                <div className={styles.topRow}>
                    <p className={styles.total}>Plan your next session and see who's coming.</p>
                    <button
                        className={styles.addButton}
                        onClick={() => {
                            setEditingId(null);
                            setShowForm((s) => !s);
                        }}
                    >
                        {showForm ? 'Close' : 'Schedule Session'}
                    </button>
                </div>
            )}

            {showForm && (
                <div className={styles.formWrapper}>
                    <ScheduleSessionForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
                </div>
            )}

            {hero ? (
                <section>
                    <h2 className={styles.sectionHeading}>Next Session</h2>
                    {renderSessionCard(hero)}
                </section>
            ) : (
                <p className={styles.empty}>No upcoming sessions scheduled yet.</p>
            )}

            {restUpcoming.length > 0 && (
                <section>
                    <h2 className={styles.sectionHeading}>Also Upcoming</h2>
                    <div className={styles.grid}>{restUpcoming.map((s) => renderSessionCard(s))}</div>
                </section>
            )}

            {past.length > 0 && (
                <section>
                    <h2 className={styles.sectionHeading}>Past Sessions</h2>
                    <div className={styles.grid}>{past.map((s) => renderSessionCard(s, { readOnly: true }))}</div>
                </section>
            )}
        </main>
    );
};

export default SchedulePage;

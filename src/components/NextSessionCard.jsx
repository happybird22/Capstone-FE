import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import RsvpControls from './RsvpControls';
import { isPartyGM, getPartyMembers } from '../services/party.service';
import { subscribeToScheduledSessions, splitUpcomingPast } from '../services/schedule.service';
import styles from './NextSessionCard.module.css';

const NextSessionCard = ({ partyId, uid }) => {
    const [isGM, setIsGM] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (!partyId) return;

        isPartyGM(partyId, uid).then(setIsGM).catch(() => setIsGM(false));
        getPartyMembers(partyId).then(setMembers).catch(() => setMembers([]));
    }, [partyId, uid]);

    useEffect(() => {
        if (!partyId) {
            setSessions([]);
            return;
        }

        const unsubscribe = subscribeToScheduledSessions(partyId, setSessions);
        return unsubscribe;
    }, [partyId]);

    if (!partyId) return null;

    const { upcoming } = splitUpcomingPast(sessions);
    const [next] = upcoming;

    if (!next) {
        if (!isGM) return null;

        return (
            <div className={styles.card}>
                <p className={styles.empty}>
                    Nothing scheduled yet — <Link to="/schedule">plan your next session</Link>.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2>Next Session</h2>
                <Link to="/schedule">View all sessions</Link>
            </div>
            <p className={styles.dateTime}>
                {format(next.dateTime.toDate(), 'PPPp')}{' '}
                <span className={styles.relative}>
                    ({formatDistanceToNow(next.dateTime.toDate(), { addSuffix: true })})
                </span>
            </p>
            {next.note && <p className={styles.note}>{next.note}</p>}
            <RsvpControls sessionId={next.id} uid={uid} members={members} />
        </div>
    );
};

export default NextSessionCard;

import { useEffect, useState } from 'react';
import { subscribeToRsvps, getRsvps, setRsvp } from '../services/schedule.service';
import styles from './RsvpControls.module.css';

const STATUS_OPTIONS = [
    { value: 'yes', label: 'Going' },
    { value: 'maybe', label: 'Maybe' },
    { value: 'no', label: "Can't Make It" },
];

const RsvpControls = ({ sessionId, uid, members = [], readOnly = false }) => {
    const [rsvps, setRsvps] = useState([]);

    useEffect(() => {
        if (readOnly) {
            getRsvps(sessionId).then(setRsvps).catch(() => setRsvps([]));
            return;
        }

        const unsubscribe = subscribeToRsvps(sessionId, setRsvps);
        return unsubscribe;
    }, [sessionId, readOnly]);

    const myStatus = rsvps.find((r) => r.uid === uid)?.status;

    const usernameFor = (rsvpUid) => members.find((m) => m.uid === rsvpUid)?.username || 'A member';

    const handleSetStatus = (status) => {
        setRsvp(sessionId, uid, status).catch((err) => console.error('Failed to set RSVP', err));
    };

    return (
        <div className={styles.rsvp}>
            {!readOnly && (
                <div className={styles.buttons}>
                    {STATUS_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            className={myStatus === value ? styles.active : styles.button}
                            onClick={() => handleSetStatus(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            <div className={styles.tally}>
                {STATUS_OPTIONS.map(({ value, label }) => {
                    const responders = rsvps.filter((r) => r.status === value);
                    if (responders.length === 0) return null;
                    return (
                        <span key={value} className={styles.tallyItem}>
                            <strong>{label}:</strong> {responders.map((r) => usernameFor(r.uid)).join(', ')}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default RsvpControls;

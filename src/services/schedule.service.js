import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { firestore } from '../config/firebase.config';

const sessionsCollection = () => collection(firestore, 'scheduledSessions');
const rsvpsCollection = (sessionId) => collection(firestore, 'scheduledSessions', sessionId, 'rsvps');

export const subscribeToScheduledSessions = (partyId, onChange) => {
    if (!partyId) {
        onChange([]);
        return () => {};
    }

    const q = query(sessionsCollection(), where('partyId', '==', partyId), orderBy('dateTime', 'asc'));

    return onSnapshot(
        q,
        (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => {
            console.error('Scheduled sessions subscription failed:', err);
            onChange([]);
        }
    );
};

export const createScheduledSession = async ({ partyId, dateTime, note, uid }) => {
    await addDoc(sessionsCollection(), {
        partyId,
        dateTime,
        note: note || '',
        createdBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const updateScheduledSession = async (sessionId, { dateTime, note }) => {
    await updateDoc(doc(firestore, 'scheduledSessions', sessionId), {
        dateTime,
        note: note || '',
        updatedAt: serverTimestamp(),
    });
};

export const deleteScheduledSession = async (sessionId) => {
    await deleteDoc(doc(firestore, 'scheduledSessions', sessionId));
};

export const subscribeToRsvps = (sessionId, onChange) => {
    return onSnapshot(
        rsvpsCollection(sessionId),
        (snap) => onChange(snap.docs.map((d) => ({ uid: d.id, ...d.data() }))),
        (err) => {
            console.error('RSVP subscription failed:', err);
            onChange([]);
        }
    );
};

export const getRsvps = async (sessionId) => {
    const snap = await getDocs(rsvpsCollection(sessionId));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
};

export const setRsvp = async (sessionId, uid, status) => {
    await setDoc(
        doc(firestore, 'scheduledSessions', sessionId, 'rsvps', uid),
        { status, respondedAt: serverTimestamp() },
        { merge: true }
    );
};

export const splitUpcomingPast = (sessions) => {
    const now = Date.now();
    const upcoming = [];
    const past = [];

    sessions.forEach((session) => {
        const ms = session.dateTime?.toMillis?.() ?? 0;
        (ms >= now ? upcoming : past).push(session);
    });

    return { upcoming, past: past.reverse() };
};

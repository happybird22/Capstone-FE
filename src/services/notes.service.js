import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { firestore } from '../config/firebase.config';

const buildVisibleTo = async ({ authorUid, partyId, visibility, sharedWith }) => {
    const visibleTo = new Set([authorUid]);

    if (visibility === 'all' && partyId) {
        const partySnap = await getDoc(doc(firestore, 'parties', partyId));
        if (partySnap.exists()) {
            (partySnap.data().members || []).forEach((uid) => visibleTo.add(uid));
        }
    }

    if (visibility === 'one') {
        (sharedWith || []).forEach((uid) => visibleTo.add(uid));
    }

    return Array.from(visibleTo);
};

const toNoteData = async (payload, authorUid, partyId) => {
    const visibility = payload.visibility || 'private';
    const sharedWith = visibility === 'one' ? (payload.sharedWith || []) : [];

    const visibleTo = await buildVisibleTo({ authorUid, partyId, visibility, sharedWith });

    return {
        campaignTitle: payload.campaignTitle,
        sessionDate: payload.sessionDate,
        notes: payload.notes,
        notableNPCs: (payload.notableNPCs || []).filter((npc) => npc.trim() !== ''),
        notablePlaces: (payload.notablePlaces || []).filter((place) => place.trim() !== ''),
        memorableMoments: payload.memorableMoments || '',
        visibility,
        sharedWith,
        visibleTo,
    };
};

export const createNote = async (payload, user) => {
    const partyId = user.partyId || null;
    const noteData = await toNoteData(payload, user.uid, partyId);

    const docRef = await addDoc(collection(firestore, 'sessionNotes'), {
        ...noteData,
        author: user.uid,
        partyId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return { _id: docRef.id, id: docRef.id, ...noteData, author: user.uid, partyId };
};

export const updateNote = async (noteId, payload, user) => {
    const noteRef = doc(firestore, 'sessionNotes', noteId);
    const existingSnap = await getDoc(noteRef);
    if (!existingSnap.exists()) throw new Error('Note not found');

    const existing = existingSnap.data();
    if (existing.author !== user.uid) {
        throw new Error('Not authorized to edit this note');
    }
    const noteData = await toNoteData(payload, existing.author, existing.partyId);

    await updateDoc(noteRef, { ...noteData, updatedAt: serverTimestamp() });

    return { _id: noteId, id: noteId, ...existing, ...noteData };
};

export const deleteNote = async (noteId) => {
    await deleteDoc(doc(firestore, 'sessionNotes', noteId));
};

export const getNoteById = async (noteId) => {
    const snap = await getDoc(doc(firestore, 'sessionNotes', noteId));
    if (!snap.exists()) return null;
    return { _id: snap.id, id: snap.id, ...snap.data() };
};

export const getDashboardNotes = async ({ uid, partyId }) => {
    const notesRef = collection(firestore, 'sessionNotes');
    const clauses = [where('visibleTo', 'array-contains', uid)];

    if (partyId) {
        clauses.push(where('partyId', '==', partyId));
    }

    const snap = await getDocs(query(notesRef, ...clauses, orderBy('sessionDate', 'desc')));

    return snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
};

// Firestore has no substring/regex query support, so search/campaign
// filtering happens client-side over the already visibility-scoped set.
export const searchNotes = (notes, { search, campaign } = {}) => {
    let filtered = notes;

    if (campaign) {
        const term = campaign.toLowerCase();
        filtered = filtered.filter((note) => note.campaignTitle?.toLowerCase().includes(term));
    }

    const term = search?.trim().toLowerCase();
    if (term) {
        filtered = filtered.filter((note) => {
            const haystack = [
                note.campaignTitle,
                note.notes,
                ...(note.notableNPCs || []),
                ...(note.notablePlaces || []),
            ]
                .join(' ')
                .toLowerCase();
            return haystack.includes(term);
        });
    }

    return filtered;
};

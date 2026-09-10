import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { firestore } from '../config/firebase.config';
import { LIBRARY_KINDS } from '../data/libraryKinds';

const libraryCollection = (partyId, kind) => collection(firestore, 'parties', partyId, kind);

const byName = (a, b) => a.name.localeCompare(b.name);

const toEntries = (snap) =>
    snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byName);

const scopedQuery = (partyId, kind, isGM) => {
    const base = libraryCollection(partyId, kind);
    return isGM ? query(base) : query(base, where('shared', '==', true));
};

export const subscribeToLibraryEntries = (partyId, kind, isGM, onChange) => {
    if (!partyId) {
        onChange([]);
        return () => {};
    }

    return onSnapshot(
        scopedQuery(partyId, kind, isGM),
        (snap) => onChange(toEntries(snap)),
        (err) => {
            console.error(`Library (${kind}) subscription failed:`, err);
            onChange([]);
        }
    );
};

export const getLibraryEntries = async (partyId, kind, { isGM } = {}) => {
    if (!partyId) return [];
    const snap = await getDocs(scopedQuery(partyId, kind, isGM));
    return toEntries(snap);
};

export const getLibraryEntryById = async (partyId, kind, entryId) => {
    const snap = await getDoc(doc(firestore, 'parties', partyId, kind, entryId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
};

export const addLibraryEntry = async (partyId, kind, entry, uid) => {
    const { hasStatus } = LIBRARY_KINDS[kind] || {};

    await addDoc(libraryCollection(partyId, kind), {
        name: entry.name,
        lore: entry.lore || '',
        shared: !!entry.shared,
        ...(hasStatus ? { status: entry.status || 'open' } : {}),
        createdBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const updateLibraryEntry = async (partyId, kind, entryId, entry) => {
    const { hasStatus } = LIBRARY_KINDS[kind] || {};

    await updateDoc(doc(firestore, 'parties', partyId, kind, entryId), {
        name: entry.name,
        lore: entry.lore || '',
        shared: !!entry.shared,
        ...(hasStatus ? { status: entry.status || 'open' } : {}),
        updatedAt: serverTimestamp(),
    });
};

export const deleteLibraryEntry = async (partyId, kind, entryId) => {
    await deleteDoc(doc(firestore, 'parties', partyId, kind, entryId));
};

export const filterLibraryEntries = (entries, search) => {
    const term = search?.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter((e) => `${e.name} ${e.lore}`.toLowerCase().includes(term));
};

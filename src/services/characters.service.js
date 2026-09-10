import { collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase.config';

const charactersCollection = (partyId) => collection(firestore, 'parties', partyId, 'characters');

const toEntries = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

export const subscribeToPartyCharacters = (partyId, onChange) => {
    if (!partyId) {
        onChange([]);
        return () => {};
    }

    return onSnapshot(
        charactersCollection(partyId),
        (snap) => onChange(toEntries(snap)),
        (err) => {
            console.error('Party characters subscription failed:', err);
            onChange([]);
        }
    );
};

export const getPartyCharacters = async (partyId) => {
    if (!partyId) return [];
    const snap = await getDocs(charactersCollection(partyId));
    return toEntries(snap);
};

export const getCharacterById = async (partyId, uid) => {
    const snap = await getDoc(doc(firestore, 'parties', partyId, 'characters', uid));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
};

export const saveMyCharacter = async (partyId, uid, { name, description }) => {
    await setDoc(doc(firestore, 'parties', partyId, 'characters', uid), {
        name,
        description: description || '',
        updatedAt: serverTimestamp(),
    });
};

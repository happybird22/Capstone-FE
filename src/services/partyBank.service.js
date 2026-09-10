import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { firestore } from '../config/firebase.config';

const inventoryCollection = (partyId) => collection(firestore, 'parties', partyId, 'inventory');

export const subscribeToPartyBankItems = (partyId, onChange) => {
    if (!partyId) {
        onChange([]);
        return () => {};
    }

    const q = query(inventoryCollection(partyId), orderBy('createdAt', 'desc'));

    return onSnapshot(
        q,
        (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => {
            console.error('Party Bank subscription failed:', err);
            onChange([]);
        }
    );
};

export const addPartyBankItem = async (partyId, item, uid) => {
    await addDoc(inventoryCollection(partyId), {
        itemName: item.itemName,
        desc: item.desc || '',
        qty: item.qty || 1,
        value: item.value === undefined ? null : item.value,
        magic: !!item.magic,
        addedBy: uid,
        createdAt: serverTimestamp(),
    });
};

export const updatePartyBankItem = async (partyId, itemId, item) => {
    await updateDoc(doc(firestore, 'parties', partyId, 'inventory', itemId), {
        itemName: item.itemName,
        desc: item.desc || '',
        qty: item.qty || 1,
        value: item.value === undefined ? null : item.value,
        magic: !!item.magic,
        updatedAt: serverTimestamp(),
    });
};

export const removePartyBankItem = async (partyId, itemId) => {
    await deleteDoc(doc(firestore, 'parties', partyId, 'inventory', itemId));
};

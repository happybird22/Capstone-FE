import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { firestore } from '../config/firebase.config';

const generateInviteCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const getUniqueInviteCode = async () => {
    const partiesRef = collection(firestore, 'parties');
    let code;
    let exists = true;

    while (exists) {
        code = generateInviteCode();
        const snap = await getDocs(query(partiesRef, where('inviteCode', '==', code), limit(1)));
        exists = !snap.empty;
    }

    return code;
};

export const createParty = async ({ name, gmUid }) => {
    const inviteCode = await getUniqueInviteCode();

    const partyRef = await addDoc(collection(firestore, 'parties'), {
        name,
        inviteCode,
        gm: gmUid,
        members: [gmUid],
        createdAt: serverTimestamp(),
    });

    await updateDoc(doc(firestore, 'users', gmUid), { partyId: partyRef.id });

    return { partyId: partyRef.id, inviteCode };
};

export const joinParty = async ({ inviteCode, uid }) => {
    const partiesRef = collection(firestore, 'parties');
    const snap = await getDocs(query(partiesRef, where('inviteCode', '==', inviteCode), limit(1)));

    if (snap.empty) {
        throw new Error('Invalid invite code');
    }

    const partyDoc = snap.docs[0];
    const party = partyDoc.data();

    if (party.members.includes(uid)) {
        throw new Error('Already in party');
    }

    await updateDoc(partyDoc.ref, { members: arrayUnion(uid) });
    await updateDoc(doc(firestore, 'users', uid), { partyId: partyDoc.id });

    return { message: 'Successfully joined party!', partyId: partyDoc.id };
};

export const getMyParty = async (user) => {
    if (!user?.partyId) return null;

    const snap = await getDoc(doc(firestore, 'parties', user.partyId));
    if (!snap.exists()) return null;

    return { _id: snap.id, id: snap.id, ...snap.data() };
};

export const getPartyMembers = async (partyId) => {
    if (!partyId) return [];

    const partySnap = await getDoc(doc(firestore, 'parties', partyId));
    if (!partySnap.exists()) return [];

    const memberUids = partySnap.data().members || [];

    const members = await Promise.all(
        memberUids.map(async (uid) => {
            const userSnap = await getDoc(doc(firestore, 'users', uid));
            if (!userSnap.exists()) return null;
            return { _id: uid, uid, username: userSnap.data().username };
        })
    );

    return members.filter(Boolean);
};

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase.config';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;

const AUTH_ERROR_MESSAGES = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password is too weak.',
    'auth/invalid-credential': 'Invalid credentials.',
    'auth/user-not-found': 'Invalid credentials.',
    'auth/wrong-password': 'Invalid credentials.',
};

const toAuthError = (err, fallback) => new Error(AUTH_ERROR_MESSAGES[err?.code] || fallback);

export const registerUser = async ({ username, email, password, role }) => {
    if (!PASSWORD_REGEX.test(password)) {
        throw new Error('Password must be at least 8 character long and include at least one letter and one number.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    let credential;
    try {
        credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (err) {
        throw toAuthError(err, 'Registration failed. Try again.');
    }

    const { uid } = credential.user;

    try {
        await setDoc(doc(firestore, 'users', uid), {
            username,
            email: normalizedEmail,
            role: role || 'player',
            partyId: null,
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.error('Failed to save user profile:', err);
        throw new Error('Account created, but saving your profile failed. Please try logging in.');
    }

    return uid;
};

export const loginUser = async ({ email, password }) => {
    try {
        await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
    } catch (err) {
        throw toAuthError(err, 'Login failed. Check your credentials and try again.');
    }
};

export const logoutUser = async () => {
    await signOut(auth);
};

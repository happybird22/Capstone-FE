import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase.config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubUserDoc = () => {};

        const unsubAuth = onAuthStateChanged(auth, (authUser) => {
            unsubUserDoc();

            if (!authUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            unsubUserDoc = onSnapshot(
                doc(firestore, 'users', authUser.uid),
                (snap) => {
                    setUser(snap.exists() ? { uid: authUser.uid, _id: authUser.uid, ...snap.data() } : null);
                    setLoading(false);
                },
                (err) => {
                    console.error('User profile fetch failed:', err);
                    setUser(null);
                    setLoading(false);
                }
            );
        });

        return () => {
            unsubAuth();
            unsubUserDoc();
        };
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Logout failed:', err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

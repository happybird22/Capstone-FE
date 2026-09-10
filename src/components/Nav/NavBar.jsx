import { useEffect, useRef, useState } from 'react';
import styles from './NavBar.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { LIBRARY_KINDS } from '../../data/libraryKinds';

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [refsOpen, setRefsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!refsOpen) return;

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setRefsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [refsOpen]);

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const topNavKinds = Object.entries(LIBRARY_KINDS).filter(([, cfg]) => cfg.topNav);
    const referenceKinds = Object.entries(LIBRARY_KINDS).filter(([, cfg]) => !cfg.topNav);

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/dashboard">Session Journal</Link>
            </div>

            <div className={styles.links}>
                {user?.role === 'gm' && (
                    <span className={styles.roleBadge}>GM View</span>
                )}
                <Link to="/notes/create" className={styles.link}>New Note</Link>
                <Link to="/parties/create" className={styles.link}>Campaigns</Link>
                <Link to="/hints" className={styles.link}>Helpful Hints</Link>
                <Link to="/party-bank" className={styles.link}>Party Bank</Link>
                <Link to="/schedule" className={styles.link}>Schedule</Link>
                <Link to="/characters" className={styles.link}>Characters</Link>
                {topNavKinds.map(([kind, { title }]) => (
                    <Link key={kind} to={`/library/${kind}`} className={styles.link}>{title}</Link>
                ))}

                <div className={styles.dropdown} ref={dropdownRef}>
                    <button
                        type="button"
                        className={styles.link}
                        onClick={() => setRefsOpen((open) => !open)}
                    >
                        References ▾
                    </button>
                    {refsOpen && (
                        <div className={styles.dropdownMenu}>
                            {referenceKinds.map(([kind, { title }]) => (
                                <Link
                                    key={kind}
                                    to={`/library/${kind}`}
                                    className={styles.dropdownItem}
                                    onClick={() => setRefsOpen(false)}
                                >
                                    {title}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={handleLogout} className={styles.logoutLink}>Logout</button>
            </div>
        </nav>
    );
};

export default NavBar;

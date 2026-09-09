import styles from './NavBar.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

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
                <Link to="/parties/create" className={styles.link}>New Party</Link>
                <Link to="/hints" className={styles.link}>Helpful Hints</Link>
                <Link to="/party-bank" className={styles.link}>Party Bank</Link>
                <button onClick={handleLogout} className={styles.logoutLink}>Logout</button>
            </div>
        </nav>
    );
};

export default NavBar;
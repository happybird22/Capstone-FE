import styles from './NavBar.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAuth } from '../../context/authContext';

const NavBar = () => {
    const { user } = useAuth();
    const [, , removeCookie] = useCookies(['jwt']);
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        removeCookie('jwt', {path: '/' });
        window.location.href = '/';
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
                <button onClick={handleLogout} className={styles.link}>Logout</button>
            </div>
        </nav>
    );
};

export default NavBar;
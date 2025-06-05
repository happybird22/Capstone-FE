import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const NavBar = () => {
    const { user } = useAuth();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">Session Journal</Link>
            </div>

            <div className={styles.links}>
                {user?.role === 'gm' && (
                    <Link to="/gm/planning" className={styles.link}>
                        GM Notes
                    </Link>
                )}
                <Link to="/notes/create" className={styles.link}>New Note</Link>
                <Link to="/Logout" className={styles.link}>Logout</Link>
            </div>
        </nav>
    );
};

export default NavBar;
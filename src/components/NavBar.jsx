import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import SearchBar from './SearchBar';

const NavBar = () => {
    const { user } = useAuth();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">Session Journal</Link>
            </div>

            <div className={styles.links}>
                {user?.role === 'gm' && (
                    <Link to="/gm/planning" className={styles.links}>
                        GM Notes
                    </Link>
                )}
                <Link to="/notes/create" className={styles.links}>New Note</Link>
                <Link to="/Logout" className={styles.links}>Logout</Link>
            </div>

            <div className={styles.search}>
                <SearchBar />
            </div>
        </nav>
    );
};

export default NavBar;
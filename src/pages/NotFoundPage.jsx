import { Link } from "react-router-dom";
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles.container}>
            <h1>404</h1>
            <p>This page doesn't exist — looks like a wild goose chase.</p>
            <Link to="/dashboard">Back to your Dashboard</Link>
        </div>
    );
};

export default NotFoundPage;

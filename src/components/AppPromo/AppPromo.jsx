import styles from './AppPromo.module.css';

const AppPromo = ({ message, cta = 'Get the App' }) => (
    <div className={styles.promo}>
        <p>{message}</p>
        <a
            href="https://www.dungeonsnotdating.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
        >
            {cta}
        </a>
    </div>
);

export default AppPromo;

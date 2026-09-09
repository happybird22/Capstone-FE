import styles from './Footer.module.css';
import logo from '../../assets/dnd-logo.jpg';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <p><strong>Brought to you by:</strong></p>
                    <img src={logo} alt="Dungeons Not Dating Logo" className={styles.logo} />
                </div>

                <div className={styles.info}>
                    <p>
                        <a href="https://www.dungeonsnotdating.com" target='_blank'>
                        Download the app</a>{' '}
                        Currently available in the US and Canada 
                    </p>
                    <p>
                        Contact: <a href="mailto:hello@dungeonsnotdating.com">hello@dungeonsnotdating.com</a>
                    </p>
                </div>
                <div className={styles.community}>
                    <p>Find us online:</p>
                    <a href="https://www.dungeonsnotdating.com"
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.website}
                    >
                        www.dungeonsnotdating.com
                    </a>
                </div>

                <div className={styles.legal}>
                    <a href="/faq.html">FAQ</a>
                    <span aria-hidden="true">·</span>
                    <a href="/privacy.html">Privacy Policy</a>
                    <span aria-hidden="true">·</span>
                    <a href="/terms.html">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import styles from '../components/AuthForm.module.css';

const RegisterPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>Join the Party!</h1>
                <p>
                    Create your own account to begin chronicling your campaigns epic story. Whether you're a cunning rogue or a wise game master, your notes await!
                </p>
            </div>

            <div className={styles.authBox}>
                <h2>Create an Account</h2>
                <RegisterForm />
                <p className={styles.switchText}>
                    Already have an account? <Link to="/">Return to login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LandingPage = () => {
    return (
        <div>
            <div>
                <h1>Greetings Adventurer!</h1>
                <p>The Session Journal is your spellbook for memories! Track your party's progress, share secrets, and revisit your most epic moments. Are you ready to log your next campaign and never forget an important NPC or place again?</p>
            </div>

            <div>
                <h2>Login to your Account</h2>
                <LoginForm />
                <p>New here? <Link to="/register">Create an Account</Link></p>
            </div>
        </div>
    );
};

export default LandingPage;
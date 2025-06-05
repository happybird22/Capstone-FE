import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <p>Loading your data...</p>;

    return (
        <div>
            <h1> Greetings Adventurer!</h1>

            <div>
                <p>Role: <strong>{user.role}</strong></p>
                <p>Party: {user.partyId ? 'Connected' : 'Not in a party yet'}</p>
            </div>

            {!user.partyId && (
                <div>
                    <Link to="/party/join" className='btn'>Join a Party</Link>
                    {user.role === 'gm' && <Link to="/party/join" className="btn">Create a Party</Link>}
                </div>
            )}

            {user.partyId}
        </div>
    )
}
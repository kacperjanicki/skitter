import React, { useState, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
// import { useAuth } from "../App";

const Dashboard = () => {
    const [error, setError] = useState("");
    const { currentUser, logout } = useContext(UserProvider);
    const navigate = useNavigate();
    const handleLogOut = async () => {
        setError("");
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            setError(err);
        }
    };
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    <span className="text-center">
                        <strong>Email: {currentUser.email}</strong>
                    </span>
                </Card.Body>
            </Card>
            <div>
                <Button variant="link" onClick={handleLogOut}>
                    Log out
                </Button>
            </div>
        </>
    );
};

export default Dashboard;

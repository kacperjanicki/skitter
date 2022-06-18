import { ref } from "firebase/database";
import React, { useState, useContext } from "react";
import { Button, Card, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { database } from "../firebase";
import { auth } from "../firebase";

const Dashboard = () => {
    const [error, setError] = useState("");
    const { setcurrentUser, currentUser, logout, email } = useContext(UserProvider);
    const { username } = useContext(UserProvider);
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
    auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
            setcurrentUser(currentUser);
        }
    });

    return (
        <>
            <Card>
                <Card.Body>
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

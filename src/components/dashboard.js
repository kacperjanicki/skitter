import { ref } from "firebase/database";
import React, { useState, useContext, useEffect } from "react";
import { Button, Card, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { database } from "../firebase";
import { auth } from "../firebase";

const Dashboard = () => {
    const [error, setError] = useState("");
    const { setcurrentUser, currentUser, logout, email, userData, setuserData } = useContext(UserProvider);
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
            {userData ? (
                <>
                    <Card>
                        <Card.Body>
                            <img src={userData.profile_picture} style={{ width: "300px", height: "200px" }} />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <span className="text-center">
                                <strong>Name: {userData.full_name}</strong>
                            </span>
                        </Card.Body>
                    </Card>
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
            ) : (
                "yikes"
            )}
        </>
    );
};

export default Dashboard;

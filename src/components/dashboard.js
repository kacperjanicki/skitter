import { ref } from "firebase/database";
import React, { useState, useContext, useEffect } from "react";
import { Button, Card, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { database } from "../firebase";
import { auth } from "../firebase";

const Dashboard = () => {
    const [error, setError] = useState("");
    const { setcurrentUser, currentUser, logout, email } = useContext(UserProvider);
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

    const url = "https://skitter-9e5e3-default-rtdb.europe-west1.firebasedatabase.app/users.json";

    const [userData, setuserData] = useState();
    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const currentObj = Object.values(data).find((obj) => obj.email === currentUser.email);
                if (currentObj) {
                    setuserData(currentObj);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    console.log(userData);

    return (
        <>
            <Card>
                <Card.Body>
                    <span className="text-center">{/* <strong>Name: {userData.full_name}</strong> */}</span>
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
    );
};

export default Dashboard;

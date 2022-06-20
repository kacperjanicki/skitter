import { ref } from "firebase/database";
import React, { useState, useContext, useEffect } from "react";
import { Button, Card, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { auth } from "../firebase";
import GenerateNav from "./GenerateNav";

const Dashboard = () => {
    const [error, setError] = useState("");
    const { setcurrentUser, currentUser, logout, email, userData, setuserData } = useContext(UserProvider);
    const navigate = useNavigate();
    console.log(userData);
    const handleLogOut = async () => {
        setError("");
        try {
            await logout();
            navigate("/home");
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
                <div style={{ position: "absolute", top: "50px" }}>
                    <GenerateNav />
                    <div className="profile">
                        <div id="left"></div>
                        <div id="middle wrap">
                            <div id="middle">
                                <img
                                    src={userData.profile_picture}
                                    style={{ width: "200px", height: "200px", borderRadius: "200px" }}
                                />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span className="text-left">
                                        <strong id="txt">{userData.full_name}</strong>
                                        <span>@{userData.username}</span>
                                    </span>
                                    <span className="text-left">
                                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                                            <div>
                                                <strong>0</strong> followers<br></br>
                                                <strong>0</strong> following
                                            </div>
                                            <div>
                                                <Button variant="secondary" size="sm">
                                                    Edit profile
                                                </Button>
                                            </div>
                                        </div>
                                    </span>
                                    <span>Add a bio</span>
                                </div>
                                <Button variant="link" onClick={handleLogOut}>
                                    Log out
                                </Button>
                            </div>
                            <div>
                                <h1>{userData.first_name}'s posts</h1>
                            </div>
                        </div>
                        <div id="right"></div>
                    </div>
                </div>
            ) : (
                <Button variant="link" onClick={handleLogOut}>
                    Log out
                </Button>
            )}
        </>
    );
};

export default Dashboard;

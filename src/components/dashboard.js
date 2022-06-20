import ShowPosts from "./ShowPosts";
import { ref } from "firebase/database";
import React, { useState, useContext, useEffect } from "react";
import { Button, Card, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { auth } from "../firebase";
import GenerateNav from "./GenerateNav";

const Dashboard = () => {
    const [error, setError] = useState("");
    const { setcurrentUser, setSortMethod, logout, userData } = useContext(UserProvider);
    const navigate = useNavigate();
    setSortMethod("BY_USR");
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
                <>
                    <div style={{ position: "absolute", top: "50px", right: 0, zIndex: 5 }}>
                        <Button onClick={handleLogOut}>Sign Out</Button>
                    </div>
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
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <span>
                                                        <strong>0</strong> follower(s)
                                                    </span>
                                                    <span>
                                                        <strong>0</strong> following
                                                    </span>

                                                    {/* <div>
                                                <Button variant="secondary" size="sm">
                                                    Edit profile
                                                </Button>
                                            </div> */}
                                                </div>
                                                <div>Add a bio</div>
                                            </div>
                                        </span>
                                        <span>Joined xx.xx.xxxx</span>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                navigate("/profile/edit");
                                            }}
                                        >
                                            Edit profile
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <h1>Your posts</h1>
                                    <div className="post-cont">
                                        <ShowPosts person={userData.username} />
                                        People you might know
                                    </div>
                                </div>
                            </div>
                            <div id="right"></div>
                        </div>
                    </div>
                </>
            ) : (
                <Button variant="link" onClick={handleLogOut}>
                    Log out
                </Button>
            )}
        </>
    );
};

export default Dashboard;

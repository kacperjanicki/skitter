import ShowPosts from "./ShowPosts";
import { get, ref, set } from "firebase/database";
import { database } from "../firebase";
import React, { useState, useContext, useEffect, useRef } from "react";
import { Alert, Button, Card, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { auth } from "../firebase";
import GenerateNav from "./GenerateNav";
import { setLogLevel } from "firebase/app";
import { BiSleepy } from "react-icons/bi";

const Dashboard = () => {
    const [error, setError] = useState("");
    const { setcurrentUser, setSortMethod, logout, userData } = useContext(UserProvider);
    const navigate = useNavigate();
    const bioref = useRef();
    setSortMethod("BY_USR");

    const handleLogOut = async () => {
        setError("");
        try {
            await logout();
            await navigate("/home");
        } catch (err) {
            setError(err);
        }
    };
    const [bio, setbio] = useState();
    useEffect(() => {
        if (userData) {
            get(ref(database, `users/${userData.username}/bio`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setbio(snapshot.val());
                }
            });
        }
    }, []);

    auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
            setcurrentUser(currentUser);
        }
    });
    const [log, setLog] = useState();
    const addbio = (e) => {
        e.preventDefault();
        try {
            setLog();
            set(ref(database, `users/${userData.username}/bio`), bioref.current.value);
            e.target.reset();
            setLog("Bio added!");
            document.getElementById("addbio").style.display = "none";
            document.getElementById("biobtn").style.display = "none";
            document.getElementById("info").style.display = "flex";
        } catch (err) {
            setError();
            setError(String(err));
        }
        console.log(bioref.current.value);
    };

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
                                <div className="middle">
                                    <img
                                        src={userData.profile_picture}
                                        style={{ width: "200px", height: "200px", borderRadius: "200px" }}
                                    />
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span className="text-left">
                                            <strong id="txt">{userData.full_name}</strong>
                                            <span>@{userData.username}</span>
                                        </span>
                                        <span className="text-left" style={{ width: "30vw" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        flexDirection: "column",
                                                    }}
                                                    id="info"
                                                >
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <span style={{ display: "flex", gap: "5px" }}>
                                                            {userData.followers ? (
                                                                <span>
                                                                    <strong>
                                                                        {
                                                                            Object.keys(userData.followers)
                                                                                .length
                                                                        }
                                                                    </strong>{" "}
                                                                    follower(s)
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    <strong>0</strong> follower(s)
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span style={{ display: "flex", gap: "5px" }}>
                                                            <strong>0</strong> following
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>

                                        {error && <Alert>{error}</Alert>}
                                        {userData.bio ? (
                                            <span style={{ marginBottom: "20px" }}>{userData.bio}</span>
                                        ) : (
                                            <span style={{ marginBottom: "20px", textAlign: "center" }}>
                                                <button
                                                    style={{
                                                        fontWeight: 700,
                                                        background: "none",
                                                        border: "none",
                                                        color: "white",
                                                    }}
                                                    onClick={() => {
                                                        navigate("/profile/edit");
                                                    }}
                                                >
                                                    Add a bio
                                                </button>
                                            </span>
                                        )}

                                        <span>Joined: {userData.when_joined}</span>

                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={async () => {
                                                navigate("/profile/edit");
                                            }}
                                        >
                                            Edit profile
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <div className="middle" style={{ paddingBottom: "10px" }}>
                                        <h1>Your posts</h1>
                                    </div>
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

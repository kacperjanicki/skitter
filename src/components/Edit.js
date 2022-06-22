import React, { useState, useContext, useEffect, useRef } from "react";
import { Alert, Button, Card, DropdownButton, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { auth, writeUserData } from "../firebase";
import GenerateNav from "./GenerateNav";

const Edit = () => {
    const [error, setError] = useState("");
    const [log, setlog] = useState();
    const fnameRef = useRef();
    const lnameRef = useRef();
    const imgRef = useRef();
    const birthRef = useRef();
    const bioRef = useRef();
    const { setcurrentUser, setSortMethod, logout, userData } = useContext(UserProvider);
    const navigate = useNavigate();
    console.log(userData);
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
    const updateusr = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setlog("");
            await writeUserData(
                userData.username,
                userData.email,
                fnameRef.current.value,
                lnameRef.current.value,
                imgRef.current.value,
                birthRef.current.value,
                userData.followers,
                userData.following,
                bioRef.current.value
            );
            await setlog("Profile updated successfully");
        } catch (err) {
            setError("");
            setError(String(err));
            console.log(err);
        }
    };

    auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
            setcurrentUser(currentUser);
        }
    });
    useEffect(() => {
        if (!userData.bio) {
            document.getElementById("exampleFormControlTextarea1").focus();
        }
    }, []);

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
                            <div className="middle edit">
                                <div className="middle">
                                    <div
                                        style={{ display: "flex", flexDirection: "column", padding: "10px" }}
                                    >
                                        <img
                                            src={userData.profile_picture}
                                            style={{ width: "200px", height: "200px", borderRadius: "200px" }}
                                        />
                                        <Form.Group>
                                            <Form.Label>IMG url</Form.Label>
                                            <Form.Control
                                                defaultValue={userData.profile_picture}
                                                ref={imgRef}
                                            ></Form.Control>
                                        </Form.Group>
                                    </div>

                                    <div
                                        style={{ display: "flex", flexDirection: "column", height: "500px" }}
                                    >
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
                                                    {/* <div>
                                                <Button variant="secondary" size="sm">
                                                    Edit profile
                                                </Button>
                                            </div> */}
                                                </div>
                                            </div>
                                        </span>
                                        <Form>
                                            <Form.Group>
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control
                                                    defaultValue={userData.first_name}
                                                    ref={fnameRef}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control
                                                    defaultValue={userData.last_name}
                                                    ref={lnameRef}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Bio</Form.Label>
                                                <textarea
                                                    placeholder={userData.bio ? "" : "Add your bio"}
                                                    Defaultvalue={userData.bio ? userData.bio : ""}
                                                    class="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="3"
                                                    ref={bioRef}
                                                ></textarea>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Date of birth</Form.Label>
                                                <Form.Control
                                                    type={"date"}
                                                    defaultValue={userData.dateBirth}
                                                    ref={birthRef}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Form>
                                        <Button onClick={updateusr}>Confirm Changes</Button>
                                        <div style={{ marginTop: "10px" }}>
                                            {error && <Alert>{error}</Alert>}
                                            {log && <Alert>{log}</Alert>}
                                        </div>
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

export default Edit;

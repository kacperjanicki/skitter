import React, { useState, useContext, useEffect, useRef } from "react";
import { Alert, Button, Card, DropdownButton, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { auth, writeUserData, storage } from "../firebase";
import GenerateNav from "./GenerateNav";
import { database } from "../firebase";
import { set } from "firebase/database";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";

const Edit = () => {
    const [error, setError] = useState("");
    const [log, setlog] = useState();
    const fnameRef = useRef();
    const lnameRef = useRef();
    const imgRef = useRef();
    const birthRef = useRef();
    const bioRef = useRef();
    const usernameRef = useRef();
    const { seteditlog } = useContext(UserProvider);
    const {
        setcurrentUser,
        setSortMethod,
        logout,
        userData,
        setuserData,
        setlocal,
        setShouldChangePostData,
    } = useContext(UserProvider);
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
    const [img, setimg] = useState();
    const [url, seturl] = useState();
    const updateusr = async (e) => {
        e.preventDefault();

        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(storage, `prof_pics/${userData.username}`);
                deleteObject(imgRef)
                    .then(() => {})
                    .catch((err) => {
                        setError(String(err));
                    });
                const snap = await uploadBytes(imgRef, img);
                const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
                seturl(url);
                console.log(url);
                set(ref(database, `users/${userData.username}/profile_picture`), url);
            };
            uploadImg();
        }
        try {
            setError("");
            setlog("");
            if (url) {
                await writeUserData(
                    userData.username,
                    userData.email,
                    fnameRef.current.value,
                    lnameRef.current.value,
                    url,
                    birthRef.current.value,
                    userData.followers,
                    userData.following,
                    bioRef.current.value,
                    true
                );

                setShouldChangePostData(true);
            } else if (!url) {
                writeUserData(
                    userData.username,
                    userData.email,
                    fnameRef.current.value,
                    lnameRef.current.value,
                    userData.profile_picture,
                    birthRef.current.value,
                    userData.followers,
                    userData.following,
                    bioRef.current.value,
                    userData.activity,
                    userData.messages,
                    true
                );

                setShouldChangePostData(true);
                seteditlog("Profile updated, refresh to see changes");
                await navigate("/profile");
            }
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
        console.log(userData);
    }, []);
    if (localStorage.getItem("mode") == "dark") {
        if (document.getElementById("mainpage")) {
            document.getElementById("mainpage").classList.add("switch");
            setlocal("white");
        }
    }

    return (
        <>
            {userData ? (
                <>
                    <div
                        className="cont home main"
                        id="mainpage"
                        style={{ display: "flex", flexDirection: "row", gap: "30px" }}
                    >
                        <GenerateNav />

                        <div className="profile">
                            <div>
                                <div className="middle" style={{ color: "white", padding: "30px" }}>
                                    <div
                                        style={{ display: "flex", flexDirection: "column", padding: "10px" }}
                                    >
                                        <img
                                            src={userData.profile_picture}
                                            style={{ width: "200px", height: "200px", borderRadius: "200px" }}
                                        />
                                        <Form.Group>
                                            <Form.Label>Profile picture</Form.Label>
                                            <Form.Control
                                                type="file"
                                                onChange={(e) => setimg(e.target.files[0])}
                                            ></Form.Control>
                                        </Form.Group>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "500px",
                                            padding: "10px",
                                        }}
                                    >
                                        <span style={{ textAlign: "left" }}>
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
                                                ></div>
                                            </div>
                                        </span>
                                        <Form onSubmit={updateusr} style={{ padding: "5px" }}>
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
                                                    class="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="3"
                                                    ref={bioRef}
                                                >
                                                    {userData.bio ? userData.bio : ""}
                                                </textarea>
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

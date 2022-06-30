import ShowPosts from "./ShowPosts";
import { get, ref, set } from "firebase/database";
import { database } from "../firebase";
import React, { useState, useContext, useEffect, useRef } from "react";
import { Alert, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { auth } from "../firebase";
import { Button as Buttonmui } from "@mui/material";
import GenerateNav from "./GenerateNav";

const Dashboard = () => {
    const [error, setError] = useState("");
    const { setcurrentUser, setSortMethod, logout, userData, setlocal, local } = useContext(UserProvider);
    const navigate = useNavigate();
    const bioref = useRef();
    setSortMethod("BY_USR");
    const [choice, setChoice] = useState();

    if (choice == "tweets") {
        setSortMethod("BY_USR");
    } else if (choice == "likes") {
        setSortMethod("USER_LIKES");
    }

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

    console.log(localStorage.getItem("mode"));
    if (localStorage.getItem("mode") == "dark") {
        if (document.getElementById("mainpage")) {
            document.getElementById("mainpage").classList.add("switch");
            setlocal("white");
        }
    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [following, setfollowing] = useState();
    const [followers, setfollowers] = useState();

    useEffect(() => {
        if (userData) {
            get(ref(database, `users/${userData.username}/following`)).then((snapshot) => {
                setfollowing(Object.values(snapshot.val()));
            });
            get(ref(database, `users/${userData.username}/followers`)).then((snapshot) => {
                setfollowers(Object.values(snapshot.val()));
            });
        }
    }, []);

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
                            <div id="middle wrap">
                                <div className="middle" style={{ color: "white" }}>
                                    <img
                                        src={userData.profile_picture}
                                        style={{ width: "200px", height: "200px", borderRadius: "200px" }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            textAlign: "left",
                                        }}
                                    >
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
                                                                <button
                                                                    style={{
                                                                        background: "none",
                                                                        border: "none",
                                                                        color: "white",
                                                                    }}
                                                                    onClick={handleShow2}
                                                                >
                                                                    <strong>
                                                                        {
                                                                            Object.keys(userData.followers)
                                                                                .length
                                                                        }
                                                                    </strong>{" "}
                                                                    follower(s)
                                                                </button>
                                                            ) : (
                                                                <span>
                                                                    <strong>0</strong> follower(s)
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span style={{ display: "flex", gap: "5px" }}>
                                                            <button
                                                                style={{
                                                                    background: "none",
                                                                    border: "none",
                                                                    color: "white",
                                                                }}
                                                                onClick={handleShow}
                                                            >
                                                                <strong>
                                                                    {Object.keys(userData.following).length}
                                                                </strong>{" "}
                                                                following
                                                            </button>
                                                        </span>
                                                        <Modal show={show} onHide={handleClose}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Following:</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <Form>
                                                                    <Form.Group className="mb-3">
                                                                        {following && following.length > 0 ? (
                                                                            following.map((person) => {
                                                                                return (
                                                                                    <div
                                                                                        style={{
                                                                                            display: "flex",
                                                                                            gap: "5px",
                                                                                            justifyItems:
                                                                                                "center",
                                                                                            border: "1px solid #dee2e6",
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            src={
                                                                                                person.profile_picture
                                                                                            }
                                                                                            style={{
                                                                                                height: "50px",
                                                                                                width: "50px",
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                navigate(
                                                                                                    `/user/${person.name}`
                                                                                                );
                                                                                            }}
                                                                                        />
                                                                                        <h3>{person.name}</h3>
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <>
                                                                                <span>
                                                                                    It seems you are not
                                                                                    following anyone...
                                                                                </span>
                                                                                <br></br>
                                                                                <a href="/suggested">
                                                                                    Look for people to follow
                                                                                </a>
                                                                            </>
                                                                        )}
                                                                    </Form.Group>
                                                                </Form>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button
                                                                    variant="secondary"
                                                                    onClick={handleClose}
                                                                >
                                                                    Close
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                        <Modal show={show2} onHide={handleClose2}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Followers:</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <Form>
                                                                    <Form.Group className="mb-3">
                                                                        {followers
                                                                            ? followers.map((person) => {
                                                                                  return (
                                                                                      <div
                                                                                          style={{
                                                                                              display: "flex",
                                                                                              gap: "5px",
                                                                                              justifyItems:
                                                                                                  "center",
                                                                                              border: "1px solid #dee2e6",
                                                                                          }}
                                                                                      >
                                                                                          <img
                                                                                              src={
                                                                                                  person.profile_picture
                                                                                              }
                                                                                              style={{
                                                                                                  height: "50px",
                                                                                                  width: "50px",
                                                                                              }}
                                                                                              onClick={() => {
                                                                                                  navigate(
                                                                                                      `/user/${person.name}`
                                                                                                  );
                                                                                              }}
                                                                                          />
                                                                                          <h3>
                                                                                              {person.name}
                                                                                          </h3>
                                                                                      </div>
                                                                                  );
                                                                              })
                                                                            : ""}
                                                                    </Form.Group>
                                                                </Form>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button
                                                                    variant="secondary"
                                                                    onClick={handleClose2}
                                                                >
                                                                    Close
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>

                                        {error && <Alert>{error}</Alert>}
                                        {userData.bio ? (
                                            <span
                                                style={{
                                                    marginBottom: "20px",
                                                    marginTop: "10px",
                                                    textAlign: "left",
                                                }}
                                            >
                                                {userData.bio}
                                            </span>
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
                                            style={{ width: "200px" }}
                                        >
                                            Edit profile
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            style={{ width: "200px" }}
                                            onClick={handleLogOut}
                                        >
                                            Log out
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <div className="middle" style={{ paddingBottom: "10px", color: "white" }}>
                                        <Buttonmui
                                            variant="secondary"
                                            id="tweetsbtn"
                                            onClick={(e) => {
                                                e.target.style.backgroundColor = "#0b5088";
                                                setChoice("tweets");
                                                e.target.addEventListener("focusout", () => {
                                                    e.target.style.backgroundColor = "";
                                                });
                                            }}
                                        >
                                            Tweets
                                        </Buttonmui>
                                        <Buttonmui
                                            variant="secondary"
                                            onClick={(e) => {
                                                e.target.style.backgroundColor = "#0b5088";
                                                setChoice("media");
                                                e.target.addEventListener("focusout", () => {
                                                    e.target.style.backgroundColor = "";
                                                });
                                            }}
                                        >
                                            Media
                                        </Buttonmui>
                                        <Buttonmui
                                            variant="secondary"
                                            onClick={(e) => {
                                                e.target.style.backgroundColor = "#0b5088";
                                                setChoice("likes");
                                                e.target.addEventListener("focusout", () => {
                                                    e.target.style.backgroundColor = "";
                                                });
                                            }}
                                        >
                                            Likes
                                        </Buttonmui>
                                    </div>

                                    <ShowPosts person={userData.username} />
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

export default Dashboard;

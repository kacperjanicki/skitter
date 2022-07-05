import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";
import GenerateNav from "./GenerateNav";
import { Button as Buttonmui } from "@mui/material";
import { Button, Modal, Form } from "react-bootstrap";
import { FaBirthdayCake, FaPlaneArrival } from "react-icons/fa";
import { database } from "../firebase";
import { ref, set } from "firebase/database";
import { BiArrowBack } from "react-icons/bi";
import { onValue, get } from "firebase/database";
import ShowPosts from "./ShowPosts";

const ProfilePage = () => {
    const { userData, setSortMethod, currentUser, local, setlocal } = useContext(UserProvider);
    let { username } = useParams();
    const history = useNavigate();

    const [show, setShow] = useState(false);
    const [choice, setChoice] = useState();
    if (choice == "tweets") {
        setSortMethod("BY_USR");
    } else if (choice == "likes") {
        setSortMethod("USER_LIKES");
    } else if (choice == "replies") {
        setSortMethod("REPLIES");
    } else if (!choice) {
        setSortMethod("BY_USR");
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(userData);
    console.log(currentUser);
    if (userData) {
        if (userData.username == username && currentUser != null) {
            history("/profile");
        }
    }
    const [follower_count, setFollower_count] = useState();
    const [count, setcount] = useState();
    const [bio, setBio] = useState();
    const [profpic, setProfpic] = useState();

    useEffect(() => {
        const count = ref(database, `users/${username}/followers`);
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                setFollower_count(snapshot.val());
                setcount(Object.keys(snapshot.val()).length);
            }
        });
        get(ref(database, `users/${username}/bio`)).then((snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.val() == false) {
                    setBio("No bio");
                } else {
                    setBio(snapshot.val());
                }
            }
        });
    }, []);
    var isBeingFollowed = false;
    if (follower_count && userData) {
        var followers_num = Object.keys(follower_count).length;
        if (Object.keys(follower_count).includes(userData.username)) {
            isBeingFollowed = true;
        }
        console.log(Object.keys(follower_count));
    }

    const [userobj, setuserobj] = useState();
    const [following, setfollowing] = useState();

    const handleFollow = () => {
        const count = ref(database, `users/${username}/followers`);
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                set(ref(database, `users/${username}/followers/${userData.username}`), {
                    //drop a follow to sb
                    name: userData.username,
                    full_name: userData.full_name,
                    profile_picture: userData.profile_picture,
                });
            }
        });
        onValue(ref(database, `users/${username}/followers`), (snapshot) => {
            const data = snapshot.val();
            setcount(Object.keys(data).length);
            // isBeingFollowed = true;
            setfollowing(true);
        });
        set(ref(database, `users/${userData.username}/following/${username}`), {
            name: username,
            profile_picture: userobj.profile_picture,
        });
    };

    const handleunFollow = () => {
        const count = ref(database, `users/${username}/followers`);
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                const asArr = Object.entries(val);
                const filtered = asArr.filter((a) => a[0] != userData.username);
                const final = Object.fromEntries(filtered);

                if (Object.keys(final).length == 0) {
                    set(ref(database, `users/${username}/followers`), false);
                } else {
                    set(ref(database, `users/${username}/followers`), final);
                }
                onValue(ref(database, `users/${username}/followers`), (snapshot) => {
                    const data = snapshot.val();
                    setcount(Object.keys(data).length);
                    // isBeingFollowed = false;
                    setfollowing(false);
                });
            }
        });
        get(ref(database, `users/${userData.username}/following`)).then((snapshot) => {
            var val = snapshot.val();
            const asArr = Object.entries(val);
            const filtered = asArr.filter((a) => a[0] != username);
            const final = Object.fromEntries(filtered);
            console.log(asArr, filtered, final);

            if (Object.keys(final).length == 0) {
                set(ref(database, `users/${userData.username}/following`), false);
            } else {
                set(ref(database, `users/${userData.username}/following`), final);
            }
        });
    };
    console.log(username);
    useEffect(() => {
        const url = "https://skitter-9e5e3-default-rtdb.europe-west1.firebasedatabase.app/users.json";
        const fetchdata = async () => {
            const data = await fetch(url);
            const json = await data.json();
            setuserobj(json[username]);
        };
        fetchdata();

        get(ref(database, `users/${username}`)).then((snapshot) => {
            setProfpic(snapshot.val().profile_picture);
        });
    }, []);
    if (localStorage.getItem("mode") == "dark") {
        if (document.querySelector(".profile")) {
            document.querySelector(".profile").classList.add("switch");
            setlocal("white");
        }
    }

    return (
        <>
            {userobj ? (
                <div
                    className="cont home main"
                    id="mainpage"
                    style={{ display: "flex", flexDirection: "row", gap: "30px" }}
                >
                    {window.innerWidth < 930 ? (
                        (() => {
                            document.querySelector(".github").style.display = "none";
                            return (
                                <button
                                    style={{
                                        position: "absolute",
                                        zIndex: 2,
                                        left: 0,
                                        margin: "5px",
                                        border: "none",
                                        color: "white",
                                        background: "none",
                                    }}
                                    onClick={() => {
                                        history(-1);
                                        document.querySelector(".github").style.display = "initial";
                                    }}
                                >
                                    <BiArrowBack size={30} />
                                </button>
                            );
                        })()
                    ) : (
                        <GenerateNav style={{ color: local }} />
                    )}
                    <div className="profile">
                        <div>
                            <div className="middle" style={{ color: "white" }}>
                                <img src={profpic} className="profileimg" />
                                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                                    <span className="text-left">
                                        <strong id="txt">{userobj.full_name}</strong>
                                        <span>@{userobj.username}</span>
                                    </span>
                                    <span className="text-left">
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexDirection: "row",
                                                    gap: "20px",
                                                }}
                                            >
                                                <span>
                                                    {count ? (
                                                        <>
                                                            <button
                                                                style={{
                                                                    border: "none",
                                                                    background: "none",
                                                                    color: "white",
                                                                }}
                                                                onClick={handleShow}
                                                            >
                                                                <strong>{count}</strong> follower(s)
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <strong>0</strong> follower(s)
                                                        </>
                                                    )}
                                                </span>
                                                <span>
                                                    <strong>0</strong> following
                                                </span>
                                            </div>
                                        </div>

                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>
                                                    {userData ? `${userobj.full_name} followers` : ""}
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form>
                                                    <Form.Group className="mb-3">
                                                        {follower_count
                                                            ? Object.values(follower_count).map((person) => {
                                                                  return (
                                                                      <div
                                                                          style={{
                                                                              display: "flex",
                                                                              gap: "5px",
                                                                              justifyItems: "center",
                                                                              border: "1px solid #dee2e6",
                                                                          }}
                                                                      >
                                                                          <img
                                                                              src={person.profile_picture}
                                                                              style={{
                                                                                  height: "50px",
                                                                                  width: "50px",
                                                                              }}
                                                                              onClick={() => {
                                                                                  history(
                                                                                      `/user/${person.name}`
                                                                                  );
                                                                              }}
                                                                          />
                                                                          <h3>{person.full_name}</h3>
                                                                          <a href={`/user/${person.name}`}>
                                                                              @{person.name}
                                                                          </a>
                                                                      </div>
                                                                  );
                                                              })
                                                            : "try refreshing the page"}
                                                    </Form.Group>
                                                </Form>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        <div style={{ marginBottom: "20px", textAlign: "left" }}>{bio}</div>
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "5px",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: "flex",
                                                alignContent: "center",
                                                gap: "5px",
                                            }}
                                        >
                                            <FaPlaneArrival size={20} />
                                            {userobj.when_joined}
                                        </span>
                                        <span
                                            style={{
                                                display: "flex",
                                                alignContent: "center",
                                                gap: "5px",
                                            }}
                                        >
                                            <FaBirthdayCake size={20} />
                                            {userobj.dateBirth}
                                        </span>
                                    </div>
                                    {(() => {
                                        if (currentUser == null) {
                                            return <Button disabled>Follow (You need to log in)</Button>;
                                        } else if (isBeingFollowed) {
                                            return <Button onClick={handleunFollow}>Unfollow</Button>;
                                        } else {
                                            if (userData && following) {
                                                return <Button onClick={handleunFollow}>Unfollow</Button>;
                                            } else if (userData && !following) {
                                                return <Button onClick={handleFollow}>Follow</Button>;
                                            } else if (userData) {
                                                return <Button onClick={handleFollow}>Follow</Button>;
                                            }
                                        }
                                    })()}
                                </div>
                            </div>

                            <div>
                                <div
                                    className="middle"
                                    style={{ paddingBottom: "10px", color: "white" }}
                                    id="mediachoose"
                                >
                                    <Buttonmui
                                        variant="secondary"
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
                                            setChoice("replies");
                                            e.target.addEventListener("focusout", () => {
                                                e.target.style.backgroundColor = "";
                                            });
                                        }}
                                    >
                                        Replies
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
                                <div className="post-cont">
                                    <ShowPosts person={userobj.username} />
                                </div>
                            </div>
                        </div>
                        <div id="right"></div>
                    </div>
                </div>
            ) : (
                "loading"
            )}
        </>
    );
};

export default ProfilePage;

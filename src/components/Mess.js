import React, { useEffect, useRef, useState } from "react";
import { auth, database } from "../firebase";
import { ref, get, onValue, set, push } from "firebase/database";
import { useContext } from "react";
import { UserProvider } from "../App";
import "./loginpage.css";
import { TbArrowBackUp } from "react-icons/tb";
import { RiDatabase2Fill, RiRadioButtonLine } from "react-icons/ri";
import { TbSend } from "react-icons/tb";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SingleUser = ({ user, selectUser }) => {
    var data = user;
    return (
        <div
            className="inbox_user"
            onClick={(e) => {
                selectUser(data);
            }}
        >
            <div style={{ width: "80px", overflow: "visible" }}>
                <img
                    src={data[1].profile_picture}
                    style={{
                        width: "80px",
                        height: "70px",
                        borderTopLeftRadius: "10px",

                        borderRadius: "20px",
                        overflow: "hidden",
                    }}
                ></img>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "10px",
                    }}
                >
                    <a href={`/user/${data[0]}`} style={{ color: "#bec3c7" }}>
                        {data[0]}
                    </a>
                    {data[1].isLoggedIn ? (
                        <div
                            style={{
                                display: "flex",
                                gap: "5px",
                                alignItems: "center",
                            }}
                        >
                            <RiRadioButtonLine style={{ color: "#7FFF00" }} />
                            Online
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                gap: "5px",
                                alignItems: "center",
                            }}
                        >
                            <RiRadioButtonLine style={{ color: "#DC143C" }} />
                            Offline
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: "5px", marginRight: "5px" }}>
                <h3>{data[1].full_name}</h3>
            </div>
        </div>
    );
};

const Mess = () => {
    const { userData } = useContext(UserProvider);
    const [users, setusers] = useState();
    const [chat, setChat] = useState();
    const [conversation, setConversation] = useState();
    const messRef = useRef();
    const [show, setshow] = useState(false);
    const handleClose = () => setshow(false);
    const handleShow = () => {
        setshow(true);
    };

    const current_user = userData;
    useEffect(() => {
        const usersref = ref(database, `users`);
        get(usersref).then((snapshot) => {
            var final = Object.entries(snapshot.val()).filter((a) => a[0] != userData.username);
            setusers(final);
        });
        if (chat) {
            handleClose();
        }
        onValue(ref(database, `users`), (snapshot) => {
            setusers(Object.entries(snapshot.val()).filter((a) => a[0] != userData.username));
        });
        if (chat) {
            onValue(
                ref(database, `/users/${chat.username}/messages/${current_user.username}`),
                (snapshot) => {
                    setConversation(Object.values(snapshot.val()));
                }
            );
        }
    }, []);

    const selectUser = (user) => {
        setConversation();
        setChat(user[1]);
        console.log(user[1]);
        get(ref(database, `/users/${user[1].username}/messages/${current_user.username}`)).then(
            (snapshot) => {
                if (snapshot.exists()) {
                    setConversation(Object.values(snapshot.val()));
                }
            }
        );
        handleClose();
    };

    if (conversation) {
        console.log(conversation);
    }

    const handleMsg = (e) => {
        var date = new Date().getTime();
        const date2 = new Date(date);
        e.preventDefault();
        console.log(messRef.current.value);
        if (current_user) {
            const convoref = ref(database, `/users/${chat.username}/messages/${current_user.username}`);
            const newmsg = push(convoref);
            set(newmsg, {
                from: current_user.username,
                from_fullname: current_user.full_name,
                body: messRef.current.value,
                when: date2.toLocaleString("sv"),
                sender_img: current_user.profile_picture,
            });
            e.target.reset();
            onValue(
                ref(database, `/users/${chat.username}/messages/${current_user.username}`),
                (snapshot) => {
                    set(
                        ref(database, `/users/${current_user.username}/messages/${chat.username}`),
                        snapshot.val()
                    );
                    set(
                        ref(database, `/users/${chat.username}/messages/${current_user.username}`),
                        snapshot.val()
                    );
                    setConversation(Object.values(snapshot.val()));
                }
            );
        }
    };
    const navigate = useNavigate();

    return (
        <div
            style={{
                width: "100vw",

                margin: 0,
            }}
            className="mess"
        >
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton style={{ backgroundColor: "#4a4e52", color: "white" }}>
                    <Modal.Title>Select user:</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#4a4e52", color: "white" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {users
                            ? users.map((user) => {
                                  onValue(
                                      ref(database, `/users/${user[1].username}/isLoggedIn`),
                                      (snapshot) => {
                                          user[1].isLoggedIn = snapshot.val();
                                      }
                                  );
                                  return (
                                      <SingleUser user={user} selectUser={selectUser} key={user.username} />
                                  );
                              })
                            : ""}
                    </div>
                </Modal.Body>
            </Modal>
            {chat ? (
                <>
                    <button
                        style={{
                            color: "white",
                            border: "none",
                            width: "80%",
                            padding: "5px",
                            marginLeft: "20px",
                            marginBottom: "10px",
                            borderRadius: "30px",
                            background: "#5c636a",
                        }}
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <TbArrowBackUp />
                            Back
                        </div>
                    </button>
                    <button
                        style={{
                            padding: "10px",
                            marginLeft: "10px",
                            position: "relative",
                            top: 0,
                            left: "25%",
                            opacity: "0.7",
                            border: "none",
                            background: "none",
                            color: "white",
                            fontSize: "20px",
                            zIndex: 10,
                        }}
                        className="choose_user"
                        onClick={handleShow}
                        id="selectuser"
                    >
                        Select a user
                    </button>
                </>
            ) : (
                ""
            )}
            <div className="mess_container">
                <div
                    style={{ width: "300px", borderLeft: "1px groove #dee2e6", paddingLeft: "5px" }}
                    className="inbox"
                >
                    <h1>Inbox</h1>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {users
                            ? users.map((user) => {
                                  onValue(
                                      ref(database, `/users/${user[1].username}/isLoggedIn`),
                                      (snapshot) => {
                                          user[1].isLoggedIn = snapshot.val();
                                      }
                                  );
                                  return (
                                      <SingleUser user={user} selectUser={selectUser} key={user.username} />
                                  );
                              })
                            : ""}
                    </div>
                </div>
                <div
                    style={{ width: "100vw", flexShrink: 1, borderLeft: "1px groove #dee2e6" }}
                    className="content"
                >
                    {chat ? (
                        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                            <div
                                style={{
                                    border: "1px groove #dee2e6",
                                    padding: "5px",
                                    width: "100vw",
                                    height: "60px",
                                    display: "flex",
                                    gap: "5px",
                                    alignItems: "baseline",
                                }}
                            >
                                <h1>{chat.full_name}</h1>
                                <a href={`/user/${chat.username}`}>@{chat.username}</a>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "60%",
                                }}
                            >
                                {conversation ? (
                                    conversation.map((msg) => {
                                        var choice;
                                        if (msg.from != current_user.username) {
                                            choice = "170px";
                                        }
                                        return (
                                            <div
                                                style={{
                                                    display: "inline-block",
                                                    padding: "10px",
                                                    margin: "2px",
                                                    marginLeft: choice,
                                                    marginRight: "auto",
                                                    whiteSpace: "initial",
                                                    border: "1px groove #dee2e6",
                                                    position: "relative",
                                                    borderRadius: "5px",
                                                }}
                                                className="chatmsg"
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <img
                                                        src={msg.sender_img}
                                                        style={{
                                                            height: "80px",
                                                            width: "80px",
                                                            borderRadius: "20%",
                                                        }}
                                                    ></img>
                                                    <span className="msgbody">{msg.body}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p style={{ margin: "5px" }}>
                                        You dont have any messages with {chat.full_name}
                                    </p>
                                )}
                            </div>

                            <div
                                id="send"
                                style={{
                                    height: "100px",
                                    width: "100%",
                                    marginTop: "auto",
                                }}
                            >
                                <form id="msgform" onSubmit={handleMsg}>
                                    <div style={{ display: "flex" }}>
                                        <input
                                            style={{ color: "white", width: "60%", padding: "5px" }}
                                            ref={messRef}
                                            placeholder="Start a new message"
                                        ></input>
                                        <button
                                            type="submit"
                                            id="msgform"
                                            style={{
                                                width: "10%",
                                                height: "100px",
                                                color: "white",
                                                border: "none",
                                                background: "#5c84a8",
                                            }}
                                        >
                                            <TbSend />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <>
                            {window.innerWidth < 500 ? (
                                <button
                                    style={{
                                        padding: "10px",
                                        marginLeft: "10px",
                                        position: "relative",
                                        opacity: "0.7",
                                        border: "none",
                                        background: "none",
                                        color: "white",
                                        fontSize: "20px",
                                    }}
                                    className="choose_user"
                                    onClick={handleShow}
                                >
                                    Select a user
                                </button>
                            ) : (
                                ""
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Mess;

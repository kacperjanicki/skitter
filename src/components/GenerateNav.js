import React, { useContext, useEffect, useState } from "react";
import { Nav, Modal, Form } from "react-bootstrap";
import { UserProvider } from "../App";
import { AiFillHome, AiOutlineSend, AiOutlineUserAdd } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { TiMessages } from "react-icons/ti";
import { CgCheck, CgProfile } from "react-icons/cg";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineLogin } from "react-icons/md";

const GenerateNav = () => {
    const {
        userData,
        currentUser,
        setShow,
        setSortMethod,
        local,
        darkMode,
        lightMode,
        displayType,
        setdisplayType,
    } = useContext(UserProvider);
    const navigate = useNavigate();
    const handleShow = () => setShow(true);
    const location = useLocation();
    console.log(location.pathname);

    const [choice, setchoice] = useState(false);
    useEffect(() => {
        setSortMethod("NEWEST-LATEST");
    }, []);
    const [show2, setShow2] = useState(false);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    return (
        <Nav
            id="test"
            fixed="top"
            bg="primary"
            variant="dark"
            style={{ display: "flex", justifyContent: "center", marginTop: "160px" }}
        >
            <ul style={{ listStyleType: "none", fontWeight: "600", fontSize: "30px" }} id="test">
                {(() => {
                    if (userData && currentUser) {
                        if (location.pathname == "/home") {
                            return (
                                <li className="navitem" style={{ marginBottom: "20px" }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AiOutlineSend />}
                                        onClick={handleShow}
                                    >
                                        Tweet
                                    </Button>
                                </li>
                            );
                        } else if (location.pathname != "/home") {
                            return (
                                <li className="navitem" style={{ marginBottom: "20px" }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AiOutlineSend />}
                                        onClick={() => {
                                            navigate("/home");
                                            handleShow();
                                        }}
                                    >
                                        Tweet
                                    </Button>
                                </li>
                            );
                        }
                    } else if (!currentUser) {
                        return (
                            <>
                                <li className="navitem" style={{ marginBottom: "5px" }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<MdOutlineLogin />}
                                        onClick={() => {
                                            navigate("/login");
                                        }}
                                    >
                                        Login
                                    </Button>
                                </li>
                                <li className="navitem" style={{ marginBottom: "20px" }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AiOutlineUserAdd />}
                                        onClick={() => {
                                            navigate("/signup");
                                        }}
                                    >
                                        Sign up
                                    </Button>
                                </li>
                            </>
                        );
                    }
                })()}
                <li className="navitem">
                    <button
                        style={{
                            border: "none",
                            background: "none",
                            marginBottom: "8px",
                            color: local,
                        }}
                        className="navbtn"
                        onClick={() => {
                            navigate("/home");
                        }}
                    >
                        <AiFillHome />
                    </button>

                    <div className="txt">Home</div>
                </li>
                {currentUser ? (
                    <>
                        <li className="navitem">
                            <button
                                style={{
                                    border: "none",
                                    background: "none",
                                    marginBottom: "8px",
                                    color: local,
                                }}
                                className="navbtn"
                                onClick={handleShow2}
                            >
                                <IoMdNotifications />
                            </button>

                            <div className="txt">Notifications</div>
                        </li>
                        <Modal show={show2} onHide={handleClose2}>
                            <Modal.Header closeButton>
                                <Modal.Title>Notifications</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        {/* {follower_count
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
                                                          history(`/user/${person.name}`);
                                                      }}
                                                  />
                                                  <h3>{person.full_name}</h3>
                                                  <a href={`/user/${person.name}`}>@{person.name}</a>
                                              </div>
                                          );
                                      })
                                    : "try refreshing the page"} */}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose2}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <li className="navitem">
                            <button
                                style={{
                                    border: "none",
                                    background: "none",
                                    marginBottom: "8px",
                                    color: local,
                                }}
                                className="navbtn"
                                onClick={() => {
                                    navigate("/messages");
                                }}
                            >
                                <TiMessages />
                            </button>

                            <div className="txt">Messages</div>
                        </li>
                        <li className="navitem">
                            <button
                                style={{
                                    border: "none",
                                    background: "none",
                                    marginBottom: "8px",
                                    color: local,
                                }}
                                className="navbtn"
                                onClick={() => {
                                    navigate("/profile");
                                }}
                            >
                                <CgProfile />
                            </button>

                            <div className="txt">Profile</div>
                        </li>
                    </>
                ) : (
                    ""
                )}
                {location.pathname == "/home" ? (
                    <Button id="modeswitch" onClick={darkMode}>
                        Light theme
                    </Button>
                ) : (
                    ""
                )}
                <li className="navitem">
                    <Button
                        size="sm"
                        variant="secondary"
                        style={{ color: local }}
                        value="NEWEST-LATEST"
                        onClick={(e) => {
                            setSortMethod(e.target.value);
                            e.target.style.backgroundColor = "#0b5088";
                            if (local == "white") {
                                e.target.style.color = "white";
                            } else if (local == "black") {
                                e.target.style.color = "white";
                            }
                            e.target.addEventListener("focusout", () => {
                                e.target.style.backgroundColor = "";
                                e.target.style.color = local;
                            });
                        }}
                        id="recent"
                    >
                        Most recent
                    </Button>
                </li>
                <li className="navitem">
                    <Button
                        size="sm"
                        style={{ color: local }}
                        variant="secondary"
                        onClick={(e) => {
                            setSortMethod(e.target.value);
                            e.target.style.backgroundColor = "#0b5088";
                            if (local == "white") {
                                e.target.style.color = "white";
                            } else if (local == "black") {
                                e.target.style.color = "white";
                            }

                            e.target.addEventListener("focusout", () => {
                                e.target.style.backgroundColor = "";
                                e.target.style.color = local;
                            });
                        }}
                        value="LATEST-NEWEST"
                        id="old"
                    >
                        Least recent
                    </Button>
                </li>
                <li className="navitem">
                    <Button
                        size="sm"
                        variant="secondary"
                        style={{ color: local }}
                        value="BY_LIKES"
                        onClick={(e) => {
                            setSortMethod(e.target.value);
                            e.target.style.backgroundColor = "#0b5088";
                            if (local == "white") {
                                e.target.style.color = "white";
                            } else if (local == "black") {
                                e.target.style.color = "white";
                            }
                            e.target.addEventListener("focusout", () => {
                                e.target.style.backgroundColor = "";
                                e.target.style.color = local;
                            });
                        }}
                    >
                        By Likes
                    </Button>
                </li>
            </ul>
        </Nav>
    );
};

export default GenerateNav;

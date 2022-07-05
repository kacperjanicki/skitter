import React, { useContext, useEffect, useState } from "react";
import { Nav, Modal, Form } from "react-bootstrap";
import Button from "@mui/material/Button";
import { Badge } from "@mui/material";
import { UserProvider } from "../App";
import { AiFillHome, AiOutlineUserAdd } from "react-icons/ai";
import { TbArrowBackUp } from "react-icons/tb";
import { IoMdNotifications } from "react-icons/io";
import { TiMessages } from "react-icons/ti";

import { CgCheck, CgProfile } from "react-icons/cg";
import { VscEdit } from "react-icons/vsc";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineLogin } from "react-icons/md";
import { get, onValue, ref, set } from "firebase/database";
import moment from "moment";
import { database } from "../firebase";

const GenerateNav = () => {
    const { userData, currentUser, setShow, setSortMethod, local, darkMode, currentLoggedin, notifications } =
        useContext(UserProvider);
    const navigate = useNavigate();
    const [activity, setActivity] = useState();
    const handleShow = () => setShow(true);
    const location = useLocation();

    useEffect(() => {
        setSortMethod("NEWEST-LATEST");
        getData();
    }, []);

    const getData = () => {
        if (userData) {
            get(ref(database, `/users/${userData.username}/activity`)).then((snapshot) => {
                const result = snapshot.val();
                const values = Object.values(result);
                var container = [];
                values.map((a) => {
                    if (Object.keys(Object.values(a)[0]).length > 1) {
                        var obj = Object.values(a)[0];
                        container.push(obj[Object.keys(obj)[0]]);
                        container.push(obj[Object.keys(obj)[1]]);
                    } else {
                        var obj = Object.values(a)[0];
                        container.push(obj[Object.keys(obj)[0]]);
                    }
                });
                container = container.filter((a) => a != false && a != undefined);
                // container = container.filter((a) => a.user != userData.username)    ;
                console.log(container);
                // setNotifications(container);
                setActivity(container);
            });
        }
    };
    if (activity) {
        console.log(activity);
    }

    const [show2, setShow2] = useState(false);
    const [datDelete, setDataDelete] = useState();
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => {
        setShow2(true);
        getData();
    };
    const markAsRead = (e) => {
        e.preventDefault();

        if (datDelete) {
            console.log(datDelete);
            const activityref = ref(
                database,
                `/users/${userData.username}/activity/post${datDelete.id}/${datDelete.name}/`
            );
            set(activityref, false);
            e.target.parentElement.parentElement.style.display = "none";
        }
    };

    function calculateDiff(e) {
        const start = moment(e);
        const end = moment(new Date().getTime());
        const diff = end.diff(start);

        //express as a duration
        const diffDuration = moment.duration(diff);

        // display
        const days = diffDuration.days();
        const hours = diffDuration.hours();
        const minutes = diffDuration.minutes();

        if (days < 1 && hours > 1) {
            return `${hours}hr, ${minutes}m ago`;
        } else if (days < 1 && hours < 1) {
            return `${minutes} minutes ago`;
        } else if (days >= 1) {
            return `${days} day ago`;
        }
    }

    return (
        <div>
            {location.pathname == "/home" ? (
                <button className="addmobile" onClick={handleShow}>
                    <VscEdit color="white" />
                </button>
            ) : (
                <button
                    className="addmobile"
                    onClick={() => {
                        handleShow();
                        navigate("/home");
                    }}
                >
                    <VscEdit color="white" />
                </button>
            )}

            <Nav bg="primary" variant="dark" id="navcontainer">
                <ul
                    style={{
                        listStyleType: "none",
                        fontWeight: "500",
                        fontSize: "30px",
                        position: "sticky",
                    }}
                    id="test"
                >
                    {(() => {
                        if (userData && currentUser) {
                            if (location.pathname == "/home") {
                                return (
                                    <li className="navitem" style={{ marginBottom: "20px" }}>
                                        <button
                                            style={{
                                                border: "none",
                                                background: "none",
                                                color: "white",
                                                borderRadius: "30px",
                                                fontSize: "20px",

                                                width: "100%",
                                                padding: "10px",
                                                backgroundColor: "#1175b8",
                                            }}
                                            onClick={handleShow}
                                            id="hidebtn"
                                        >
                                            Tweet
                                        </button>
                                    </li>
                                );
                            } else if (location.pathname != "/home") {
                                return (
                                    <>
                                        {window.innerWidth > 1200 ? (
                                            <button
                                                style={{
                                                    color: "white",
                                                    border: "none",
                                                    width: "80%",
                                                    padding: "5px",
                                                    marginBottom: "10px",
                                                    borderRadius: "30px",
                                                    background: "#5c636a",
                                                }}
                                                onClick={() => {
                                                    if (location.pathname == "/profile") {
                                                        navigate(-3);
                                                    } else {
                                                        navigate(-1);
                                                    }
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
                                        ) : (
                                            ""
                                            // <button
                                            //     style={{
                                            //         position: "fixed",
                                            //         zIndex: 5,
                                            //         left: 30,
                                            //         top: 0,
                                            //         margin: "5px",
                                            //         border: "none",
                                            //         color: "white",
                                            //         background: "none",
                                            //     }}
                                            //     onClick={() => {
                                            //         if (location.pathname == "/profile") {
                                            //             navigate(-3);
                                            //         } else {
                                            //             navigate(-1);
                                            //         }
                                            //     }}
                                            // >
                                            //     <TbArrowBackUp size={30} />
                                            // </button>
                                        )}

                                        <li className="navitem" style={{ marginBottom: "20px" }} id="hidebtn">
                                            <button
                                                style={{
                                                    border: "none",
                                                    background: "none",
                                                    color: "white",
                                                    borderRadius: "30px",
                                                    fontSize: "20px",

                                                    width: "100%",
                                                    padding: "10px",
                                                    backgroundColor: "#1175b8",
                                                }}
                                                onClick={() => {
                                                    handleShow();
                                                    navigate("/home");
                                                }}
                                            >
                                                Tweet
                                            </button>
                                        </li>
                                    </>
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
                                            size="sm"
                                        >
                                            Sign up
                                        </Button>
                                    </li>
                                </>
                            );
                        }
                    })()}
                    <li className="navitem">
                        {window.innerWidth < 1200 ? (
                            <button
                                style={{
                                    border: "none",
                                    background: "none",
                                    marginBottom: "8px",
                                    color: "white",
                                }}
                                className="navbtn"
                                onClick={() => {
                                    navigate("/home");
                                }}
                            >
                                <AiFillHome />
                            </button>
                        ) : (
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
                        )}

                        <div
                            className="txt"
                            style={
                                location.pathname == "/home" ? { fontWeight: "600" } : { fontWeight: "500" }
                            }
                        >
                            Home
                        </div>
                    </li>
                    {currentUser ? (
                        <>
                            <li className="navitem">
                                {window.innerWidth < 1200 ? (
                                    <button
                                        style={{
                                            border: "none",
                                            background: "none",
                                            marginBottom: "8px",
                                            color: "white",
                                        }}
                                        className="navbtn"
                                        onClick={handleShow2}
                                    >
                                        {activity ? (
                                            <Badge badgeContent={activity.length} color="primary">
                                                <IoMdNotifications />
                                            </Badge>
                                        ) : (
                                            <IoMdNotifications />
                                        )}
                                    </button>
                                ) : (
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
                                        {activity ? (
                                            <Badge badgeContent={activity.length} color="primary">
                                                <IoMdNotifications />
                                            </Badge>
                                        ) : (
                                            <IoMdNotifications />
                                        )}
                                    </button>
                                )}

                                <div className="txt">Activity</div>
                            </li>
                            <Modal show={show2} onHide={handleClose2}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Activity</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            {activity && Object.keys(activity).length > 0
                                                ? activity.map((notif) => {
                                                      if (notif) {
                                                          return (
                                                              <div
                                                                  style={{
                                                                      display: "flex",
                                                                      width: "100%",
                                                                      border: "1px solid #dee2e6",
                                                                      justifyContent: "space-between",
                                                                  }}
                                                              >
                                                                  <div style={{ display: "flex" }}>
                                                                      <div
                                                                          style={{
                                                                              display: "flex",
                                                                              flexDirection: "column",
                                                                          }}
                                                                      >
                                                                          <img
                                                                              src={notif.user_img}
                                                                              style={{
                                                                                  height: "50px",
                                                                                  width: "50px",
                                                                              }}
                                                                              onClick={() => {
                                                                                  navigate(
                                                                                      `/user/${notif.user}`
                                                                                  );
                                                                              }}
                                                                          />
                                                                          <a
                                                                              href={`/user/${notif.user}`}
                                                                              style={{ color: "black" }}
                                                                          >
                                                                              @{notif.user}
                                                                          </a>
                                                                      </div>

                                                                      {notif.type == "like" ? (
                                                                          <h5>
                                                                              <span
                                                                                  style={{
                                                                                      fontWeight: "600",
                                                                                  }}
                                                                              >
                                                                                  {notif.user_fname}
                                                                              </span>{" "}
                                                                              liked your{" "}
                                                                              <a href={`/post/${notif.ref}`}>
                                                                                  post
                                                                              </a>
                                                                          </h5>
                                                                      ) : (
                                                                          <h5>
                                                                              <span
                                                                                  style={{
                                                                                      fontWeight: "600",
                                                                                  }}
                                                                              >
                                                                                  {notif.user_fname}
                                                                              </span>{" "}
                                                                              commented on your{" "}
                                                                              <a href={`/post/${notif.ref}`}>
                                                                                  post
                                                                              </a>
                                                                          </h5>
                                                                      )}
                                                                  </div>
                                                                  <div
                                                                      style={{
                                                                          display: "flex",
                                                                          flexDirection: "column",
                                                                          //   marginLeft: "auto",
                                                                          //   width: "70px",
                                                                      }}
                                                                  >
                                                                      <button
                                                                          style={{
                                                                              //   marginLeft: "auto",
                                                                              height: "30px",
                                                                              width: "50px",
                                                                              marginLeft: "auto",
                                                                              border: "none",
                                                                          }}
                                                                          onClick={(e) => {
                                                                              console.log(notif);
                                                                              setDataDelete({
                                                                                  name: notif.user,
                                                                                  id: notif.ref,
                                                                              });
                                                                              markAsRead(e);
                                                                          }}
                                                                      >
                                                                          Read
                                                                      </button>
                                                                      <span
                                                                          style={{
                                                                              textAlign: "right",
                                                                              paddingRight: "5px",
                                                                          }}
                                                                      >
                                                                          {calculateDiff(notif.when)}
                                                                      </span>
                                                                  </div>
                                                              </div>
                                                          );
                                                      }
                                                  })
                                                : "I dont see any traffic..."}
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
                                {window.innerWidth < 1200 ? (
                                    <button
                                        style={{
                                            border: "none",
                                            background: "none",
                                            marginBottom: "8px",
                                            color: "white",
                                        }}
                                        className="navbtn"
                                        onClick={() => {
                                            if (currentUser) {
                                                navigate("/profile/messages");
                                            }
                                        }}
                                    >
                                        <TiMessages />
                                    </button>
                                ) : (
                                    <button
                                        style={{
                                            border: "none",
                                            background: "none",
                                            marginBottom: "8px",
                                            color: local,
                                        }}
                                        className="navbtn"
                                        onClick={() => {
                                            if (currentUser) {
                                                navigate("/profile/messages");
                                            }
                                        }}
                                    >
                                        <TiMessages />
                                    </button>
                                )}

                                <div className="txt">Messages</div>
                            </li>
                            <li className="navitem">
                                {window.innerWidth < 1200 ? (
                                    <button
                                        style={{
                                            border: "none",
                                            background: "none",
                                            marginBottom: "8px",
                                            color: "white",
                                        }}
                                        className="navbtn"
                                        onClick={() => {
                                            navigate(`/user/${currentLoggedin}`);
                                        }}
                                    >
                                        <CgProfile />
                                    </button>
                                ) : (
                                    <button
                                        style={{
                                            border: "none",
                                            background: "none",
                                            marginBottom: "8px",
                                            color: local,
                                        }}
                                        className="navbtn"
                                        onClick={() => {
                                            navigate(`/user/${currentLoggedin}`);
                                        }}
                                    >
                                        <CgProfile />
                                    </button>
                                )}

                                <div
                                    className="txt"
                                    style={
                                        location.pathname == "/profile"
                                            ? { fontWeight: "600" }
                                            : { fontWeight: "500" }
                                    }
                                >
                                    Profile
                                </div>
                            </li>
                        </>
                    ) : (
                        ""
                    )}
                    {location.pathname == "/home" ? (
                        <>
                            {window.innerWidth < 1200 ? (
                                <Button
                                    id="modeswitch"
                                    size="sm"
                                    onClick={darkMode}
                                    style={{ color: "white" }}
                                >
                                    Light theme
                                </Button>
                            ) : (
                                <Button id="modeswitch" size="sm" onClick={darkMode} style={{ color: local }}>
                                    Light theme
                                </Button>
                            )}

                            <li className="hidebtn">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    id="sortbtn"
                                    onClick={() => {
                                        if (document.getElementById("methods").style.display == "flex") {
                                            document.getElementById("methods").style.display = "none";
                                            document.getElementById("sortbtn").innerHTML = "Sort method";
                                        } else {
                                            document.getElementById("methods").style.display = "flex";
                                            document.getElementById("sortbtn").innerHTML = "Hide";
                                        }
                                    }}
                                >
                                    Sort method
                                </Button>
                            </li>
                            <li
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                    alignItems: "center",
                                    marginTop: "5px",
                                    display: "none",
                                }}
                                id="methods"
                            >
                                <li className="navitem">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        style={{ color: local, opacity: "0.8" }}
                                        value="NEWEST-LATEST"
                                        onClick={(e) => {
                                            setSortMethod(e.target.value);
                                            e.target.style.backgroundColor = "#0b5088";
                                            e.target.style.opacity = "1";
                                            if (local == "white") {
                                                e.target.style.color = "white";
                                            } else if (local == "black") {
                                                e.target.style.color = "white";
                                            }
                                            e.target.addEventListener("focusout", () => {
                                                e.target.style.backgroundColor = "";
                                                e.target.style.color = "white";
                                                e.target.style.opacity = "0.8";
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
                                        style={{ color: local, opacity: "0.8" }}
                                        variant="secondary"
                                        onClick={(e) => {
                                            setSortMethod(e.target.value);
                                            e.target.style.backgroundColor = "#0b5088";
                                            e.target.style.opacity = "1";
                                            if (local == "white") {
                                                e.target.style.color = "white";
                                            } else if (local == "black") {
                                                e.target.style.color = "white";
                                            }

                                            e.target.addEventListener("focusout", () => {
                                                e.target.style.backgroundColor = "";
                                                e.target.style.color = "white";
                                                e.target.style.opacity = "0.8";
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
                                        style={{ color: local, opacity: "0.8" }}
                                        variant="secondary"
                                        value="BY_LIKES"
                                        onClick={(e) => {
                                            setSortMethod(e.target.value);
                                            e.target.style.backgroundColor = "#0b5088";
                                            e.target.style.opacity = "1";
                                            if (local == "white") {
                                                e.target.style.color = "white";
                                            } else if (local == "black") {
                                                e.target.style.color = "white";
                                            }
                                            e.target.addEventListener("focusout", () => {
                                                e.target.style.backgroundColor = "";
                                                e.target.style.color = "white";
                                                e.target.style.opacity = "0.8";
                                            });
                                        }}
                                    >
                                        By Likes
                                    </Button>
                                </li>
                            </li>
                        </>
                    ) : (
                        ""
                    )}
                </ul>
            </Nav>
        </div>
    );
};

export default GenerateNav;

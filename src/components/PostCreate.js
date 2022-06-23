import React, { useContext, useRef, useState } from "react";
import { FloatingLabel, Form, Button, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import { writePostData } from "../firebase";
import "./loginpage.css";

const PostCreate = () => {
    const { userData, currentUser } = useContext(UserProvider);
    const { setSortMethod, sortMethod } = useContext(UserProvider);
    const [error, setError] = useState();
    const [log, setLog] = useState();

    const text = useRef();
    const formSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) {
            setError(`You have to log in`);
        } else if (userData) {
            try {
                console.log(userData);
                writePostData(userData.username, text.current.value, userData.profile_picture);
                e.target.reset();
                setLog("Post sent!");
                setSortMethod("NEWEST-LATEST");
                document.getElementById("recent").click();
                // document.getElementById("checked").selected = true;
            } catch (err) {
                setError("");
                setError(String(err));
            }
        }
    };
    // const handlesort = (e) => {
    //     console.log(sortMethod);
    //     setSortMethod(e.target.value);

    //     console.log(e.target.value);
    // };

    return (
        <div className="form">
            <form onSubmit={formSubmit} id="postform">
                <textarea
                    placeholder="Add your post"
                    ref={text}
                    style={{ height: "100px", width: "600px", padding: "10px", marginTop: "20px" }}
                    id="postform"
                />
                {error && (
                    <Alert variant="danger" style={{ width: "600px" }}>
                        {error}
                    </Alert>
                )}
                {log && (
                    <Alert variant="success" style={{ width: "600px" }}>
                        {log}
                    </Alert>
                )}
                <div className="publish_container">
                    <Button type="submit" form="postform">
                        Publish
                    </Button>
                    <div>
                        <Button
                            size="sm"
                            variant="secondary"
                            value="NEWEST-LATEST"
                            onClick={(e) => {
                                setSortMethod(e.target.value);
                                e.target.style.backgroundColor = "#0b5088";
                                e.target.addEventListener("focusout", () => {
                                    e.target.style.backgroundColor = "";
                                });
                                document.getElementById("old").addEventListener("click", () => {
                                    e.target.style.backgroundColor = "";
                                });
                            }}
                            id="recent"
                        >
                            Most recent
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                                setSortMethod(e.target.value);
                                e.target.style.backgroundColor = "#0b5088";
                                e.target.addEventListener("focusout", () => {
                                    e.target.style.backgroundColor = "";
                                });
                            }}
                            value="LATEST-NEWEST"
                            id="old"
                        >
                            Least recent
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            value="BY_LIKES"
                            onClick={(e) => {
                                setSortMethod(e.target.value);
                                e.target.style.backgroundColor = "#0b5088";
                                e.target.addEventListener("focusout", () => {
                                    e.target.style.backgroundColor = "";
                                });
                            }}
                        >
                            By Likes
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostCreate;

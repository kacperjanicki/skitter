import React, { useContext, useRef, useState } from "react";
import { Container, Navbar, Nav, FloatingLabel, Form, Button, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateNav from "./GenerateNav";
import { writePostData } from "../firebase";
import "./loginpage.css";
import { postReducer } from "../reducers";

const PostCreate = () => {
    const { userData } = useContext(UserProvider);
    const { setSortMethod } = useContext(UserProvider);
    const [error, setError] = useState();
    const [log, setLog] = useState();

    const text = useRef();
    const formSubmit = (e) => {
        e.preventDefault();
        if (!userData) {
            setError(`You have to log in`);
        } else if (userData) {
            try {
                console.log(userData);
                writePostData(userData.username, text.current.value, userData.profile_picture);
                e.target.reset();
                setLog("Post sent!");
                setSortMethod("NEWEST-LATEST");
                document.getElementById("checked").selected = true;
            } catch (err) {
                setError("");
                setError(String(err));
            }
        }
    };
    const handleSort = (e) => {
        // console.log(e.target.value);
        setSortMethod(e.target.value);
    };

    return (
        <div className="form">
            <form onSubmit={formSubmit}>
                <FloatingLabel controlId="floatingTextarea2" label="Start typing...">
                    <Form.Control as="input" ref={text} style={{ height: "100px", width: "600px" }} />
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
                        <Button>Publish</Button>
                        <Form.Select onChange={handleSort} aria-label="Sort by:" style={{ width: "150px" }}>
                            <option>Sort by:</option>
                            <option value="NEWEST-LATEST" id="checked" selected={false}>
                                Most recent
                            </option>
                            <option value="LATEST-NEWEST">Least recent</option>
                            <option value="BY_LIKES">Highest likes</option>
                        </Form.Select>
                    </div>
                </FloatingLabel>
            </form>
        </div>
    );
};

export default PostCreate;

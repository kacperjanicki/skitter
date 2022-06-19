import React, { useContext, useRef, useState } from "react";
import { Container, Navbar, Nav, FloatingLabel, Form, Button, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateNav from "./GenerateNav";
import { writePostData } from "../firebase";
import "./loginpage.css";

const PostCreate = () => {
    const { userData } = useContext(UserProvider);
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
            } catch (err) {
                setError("");
                setError(String(err));
            }
        }
    };
    return (
        <div className="form">
            <form onSubmit={formSubmit}>
                <FloatingLabel controlId="floatingTextarea2" label="Start typing...">
                    <Form.Control as="input" ref={text} style={{ height: "100px", width: "450px" }} />
                    {error && <Alert variant="danger">{error}</Alert>}
                    {log && <Alert variant="success">{log}</Alert>}
                    <Button>Publish</Button>
                </FloatingLabel>
            </form>
        </div>
    );
};

export default PostCreate;

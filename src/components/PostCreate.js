import React, { useContext, useState } from "react";
import { Container, Navbar, Nav, FloatingLabel, Form, Button, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateNav from "./GenerateNav";
import { writePostData } from "../firebase";
import "./loginpage.css";

const PostCreate = () => {
    const { userData } = useContext(UserProvider);
    const [error, setError] = useState();
    const [log, setLog] = useState();
    const formSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        console.log("sent");
        if (!userData) {
            setError(`You have to log in`);
        } else if (userData) {
            setLog("Post sent!");
        }

        writePostData("post", userData.full_name, "test");
    };
    return (
        <div className="form">
            {error && <Alert variant="danger">{error}</Alert>}
            {log && <Alert variant="success">{log}</Alert>}
            <form onSubmit={formSubmit}>
                <FloatingLabel controlId="floatingTextarea2" label="Start typing...">
                    <Form.Control as="input" style={{ height: "100px", width: "450px" }} />
                </FloatingLabel>
                <Button>Publish</Button>
            </form>
        </div>
    );
};

export default PostCreate;

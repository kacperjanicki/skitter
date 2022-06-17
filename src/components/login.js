import React, { useContext, useRef, useState, useEffect } from "react";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./loginpage.css";
import { UserProvider } from "../App";
import { Link, useNavigate } from "react-router-dom";

const ActualLogin = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useContext(UserProvider);
    const { currentUser } = useContext(UserProvider);
    const [error, setError] = useState("");
    const [log, setLog] = useState("");
    const { loading, setLoading } = useContext(UserProvider);
    const history = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLog("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            history("/");
            await setLog("Logged in successfully");
        } catch (err) {
            setError("");
            setError(String(err));
        }
        setLoading(false);
    }

    return (
        <div className="cont">
            <div className="container">
                <div className="main">
                    <span id="title">Skitter</span>
                    <div className="login">
                        <Card>
                            <Card.Body>
                                <h2>Login</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {log && <Alert variant="success">{log}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group id="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" ref={emailRef} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group id="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" ref={passwordRef} required></Form.Control>
                                    </Form.Group>
                                    <Button className="w-100" type="submit" disabled={loading}>
                                        Log In
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <div className="w-100 text-center mt-2 text-white text-decoration-none">
                            <Link to={"/signup"} style={{ color: "white", textDecoration: "none", fontWeight: 500 }}>
                                <span>Create an account</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActualLogin;

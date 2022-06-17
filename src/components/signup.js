import React, { useContext, useRef, useState, useEffect } from "react";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./loginpage.css";
import { UserProvider } from "../App";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useContext(UserProvider);
    const { currentUser } = useContext(UserProvider);
    console.log({ signup });
    const [error, setError] = useState("");
    const [log, setLog] = useState("");
    const history = useNavigate();
    const { loading, setLoading } = useContext(UserProvider);

    async function handleSubmit(e) {
        e.preventDefault();
        if (passwordConfirmRef.current.value !== passwordRef.current.value) {
            return setError("Passwords do not match");
        }
        try {
            setError("");
            setLog("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            history("/");
            await setLog("User created successfully");
        } catch (err) {
            setError("");
            setError(String(err)); //if email already in database
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
                                <h2>Sign up</h2>
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
                                    <Form.Group id="password-confirm">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control type="password" ref={passwordConfirmRef} required></Form.Control>
                                    </Form.Group>
                                    <Button className="w-100" type="submit" disabled={loading}>
                                        Sign up
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <div className="w-100 text-center mt-2 text-light">
                            Already have an account?
                            <Link to={"/login"} style={{ color: "white", textDecoration: "none", fontWeight: 500 }}>
                                <span> Log in</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

import React, { useContext, useRef, useState, useEffect } from "react";
import { auth, writeUserData } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./loginpage.css";
import { UserProvider } from "../App";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const dateRef = useRef();
    const avatarRef = useRef();
    const usernameRef = useRef(); //
    const fnameRef = useRef(); //   they go to user database
    const lnameRef = useRef(); //
    const { signup } = useContext(UserProvider);
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
            await writeUserData(
                usernameRef.current.value,
                emailRef.current.value,
                fnameRef.current.value,
                lnameRef.current.value,
                avatarRef.current.value,
                dateRef.current.value,
                false,
                false
            );

            history("/home");
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
                                    <Form.Group id="username">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" ref={usernameRef} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group id="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" ref={emailRef} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group id="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            ref={passwordRef}
                                            required
                                        ></Form.Control>
                                    </Form.Group>
                                    <Form.Group id="password-confirm">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            ref={passwordConfirmRef}
                                            required
                                        ></Form.Control>
                                    </Form.Group>
                                    <Form.Group id="password-confirm">
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control type="date" ref={dateRef} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group id="password-confirm">
                                        <Form.Label>Avatar (url)</Form.Label>
                                        <Form.Control type="url" ref={avatarRef} required></Form.Control>
                                    </Form.Group>

                                    <div className="row">
                                        <div className="col">
                                            <Form.Label>First name</Form.Label>
                                            <Form.Control type="text" required ref={fnameRef}></Form.Control>
                                        </div>
                                        <div className="col">
                                            <Form.Label>Last name</Form.Label>
                                            <Form.Control type="text" required ref={lnameRef}></Form.Control>
                                        </div>
                                    </div>

                                    {/* DATE OF BIRTH */}

                                    <Button className="w-100" type="submit" disabled={loading}>
                                        Sign up
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <div className="w-100 text-center mt-2 text-light">
                            Already have an account?
                            <Link
                                to={"/login"}
                                style={{ color: "white", textDecoration: "none", fontWeight: 500 }}
                            >
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

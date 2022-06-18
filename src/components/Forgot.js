import React, { useContext, useRef, useState, useEffect } from "react";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./loginpage.css";
import { UserProvider } from "../App";
import { Link, useNavigate } from "react-router-dom";

const Forgot = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, resetpass } = useContext(UserProvider);
    const [error, setError] = useState("");
    const [log, setLog] = useState("");
    const { loading, setLoading } = useContext(UserProvider);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLog("");
            setLoading(true);
            await resetpass(emailRef.current.value);
            await setLog("Email sent successfully, check your spam folder");
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
                                <h2>Reset Password</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {log && <Alert variant="success">{log}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group id="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" ref={emailRef} required></Form.Control>
                                    </Form.Group>
                                    <Button className="w-100" type="submit" disabled={loading}>
                                        Reset Password
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <div className="w-100 text-center mt-3 text-white">
                            <Link to="/login" style={{ color: "white", textDecoration: "none", fontWeight: 500 }}>
                                Go back to login page
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forgot;

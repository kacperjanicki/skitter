import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/authcontext";
import { AuthProvider } from "../context/authcontext";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./loginpage.css";
import { auth } from "../firebase";

function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
}

const LoginPage = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (passwordConfirmRef.current.value !== passwordRef.current.value) {
            return setError("Passwords do not match");
        }
        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
        } catch (err) {
            setError("failed to create an account");
            console.log(err);
        }
        setLoading(false);
    }

    return (
        <div className="container">
            <div className="main">
                <span id="title">Skitter</span>
                <div className="login">
                    <AuthProvider>
                        <Card>
                            <Card.Body>
                                <h2>Sign up</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
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
                    </AuthProvider>
                    <div className="w-100 text-center mt-2">Already have an Account? Log in</div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

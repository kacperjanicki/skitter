import React, { useContext, useRef, useState, useEffect } from "react";
import { auth, writeUserData, storage } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./loginpage.css";
import { UserProvider } from "../App";
import { Link, useNavigate } from "react-router-dom";

import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const LoginPage = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const dateRef = useRef();
    const avatarRef = useRef();
    const usernameRef = useRef(); //
    const fnameRef = useRef(); //   they go to user database
    const lnameRef = useRef(); //
    const { signup, login, currentUser } = useContext(UserProvider);
    const [error, setError] = useState("");
    const [log, setLog] = useState("");
    const [img, setimg] = useState();
    const [url, seturl] = useState();

    const history = useNavigate();
    const { loading, setLoading, setlocal, local } = useContext(UserProvider);

    async function handleSubmit(e) {
        e.preventDefault();
        if (passwordConfirmRef.current.value !== passwordRef.current.value) {
            return setError("Passwords do not match");
        }

        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(storage, `prof_pics/${usernameRef.current.value}`);
                const snap = await uploadBytes(imgRef, img);
                const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
                seturl(url);
                // console.log(url);
            };
            uploadImg();
        }

        console.log(dateRef.current.value);
        try {
            setError("");
            setLog("");
            setLoading(true);

            if (url) {
                await writeUserData(
                    usernameRef.current.value,
                    emailRef.current.value,
                    fnameRef.current.value,
                    lnameRef.current.value,
                    url,
                    String(dateRef.current.value),
                    false,
                    false,
                    false,
                    true
                );
                await signup(emailRef.current.value, passwordRef.current.value);
                await login(emailRef.current.value, passwordRef.current.value);
                await setLog("User created successfully");
                history("/home");
            }
        } catch (err) {
            setError("");
            setError(String(err)); //if email already in database
        }
        setLoading(false);
    }
    useEffect(() => {
        if (localStorage.getItem("mode") == "dark") {
            if (document.querySelector(".profile")) {
                document.querySelector(".profile").classList.add("switch");
                // setlocal("black");
            }
        }
    }, []);

    return (
        <div
            className="cont home main profile"
            id="mainpage"
            style={{ display: "flex", flexDirection: "row", gap: "30px", width: "600px" }}
        >
            <div className="login">
                <Card style={{ color: "black" }}>
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
                                <Form.Control type="password" ref={passwordRef} required></Form.Control>
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
                                <Form.Label>Profile picture</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setimg(e.target.files[0])}
                                    required
                                ></Form.Control>
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

                            <Button className="w-100" type="submit" disabled={loading}>
                                Sign up
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

                <div className="w-100 text-center mt-2" style={{ color: local }}>
                    Already have an account?
                    <Link to={"/login"} style={{ color: local, fontWeight: 500 }}>
                        <span> Log in</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

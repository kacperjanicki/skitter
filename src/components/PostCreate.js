import React, { useContext, useRef, useState } from "react";
import { FloatingLabel, Form, Button, Alert, Modal } from "react-bootstrap";
import { UserProvider } from "../App";
import { writePostData } from "../firebase";
import "./loginpage.css";

const PostCreate = () => {
    const { userData, currentUser } = useContext(UserProvider);
    const { setSortMethod, sortMethod, setShow, showModal } = useContext(UserProvider);
    const [error, setError] = useState();
    const [log, setLog] = useState();

    const text = useRef();
    const formSubmit = (e) => {
        if (!currentUser) {
            setError(`You have to log in`);
        } else if (userData) {
            try {
                console.log(userData);
                writePostData(userData.username, text.current.value, userData.profile_picture);
                setLog("Post sent!");
                setSortMethod("NEWEST-LATEST");
                document.getElementById("recent").click();
                // document.getElementById("checked").selected = true;
            } catch (err) {
                setError("");
                setError(String(err));
                console.log(err);
            }
        }
    };
    const handleClose = () => {
        setShow(false);
    };

    return (
        <div className="form">
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
                <div className="d-flex align-items-center justify-content-center"></div>
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                        <form onSubmit={formSubmit} id="postform">
                            <textarea
                                placeholder="What's on your mind?"
                                ref={text}
                                style={{ height: "100px", width: "100%", padding: "10px" }}
                                id="postform"
                                autoFocus={true}
                            />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                handleClose();
                                formSubmit();
                            }}
                        >
                            Send
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default PostCreate;

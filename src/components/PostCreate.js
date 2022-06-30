import React, { useContext, useRef, useState, useEffect } from "react";
import { FloatingLabel, Form, Button, Alert, Modal } from "react-bootstrap";
import { UserProvider } from "../App";
import { writePostData } from "../firebase";
import "./loginpage.css";
import { database, storage } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const PostCreate = () => {
    const { userData, currentUser } = useContext(UserProvider);
    const { setSortMethod, sortMethod, postcount, setShow, showModal } = useContext(UserProvider);
    const [error, setError] = useState();
    const [log, setLog] = useState();
    const [innertext, setinnertext] = useState("");
    const [url, seturl] = useState();
    const [img, setimg] = useState();
    useEffect(() => {
        if (showModal) {
            setimg();
        }
    }, []);

    const text = useRef();
    const formSubmit = (e) => {
        if (!currentUser) {
            setError(`You have to log in`);
        } else if (userData) {
            if (img) {
                console.log(img);
                try {
                    const uploadImg = async () => {
                        const imgRef = ref(storage, `post_assets/${postcount + 1}`);
                        const snap = await uploadBytes(imgRef, img);
                        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
                        seturl(url);
                        if (url) {
                            writePostData(userData.username, innertext, userData.profile_picture, url);
                        }
                    };
                    uploadImg();
                } catch (err) {
                    console.log(err);
                }
            }
            try {
                console.log(userData);

                if (!img && !url) {
                    writePostData(userData.username, text.current.value, userData.profile_picture, false);
                }

                setSortMethod("NEWEST-LATEST");
                document.getElementById("recent").click();
            } catch (err) {
                setError("");
                setError(String(err));
                console.log(err);
            }
            setLog("Post sent!");
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
                                onChange={(e) => {
                                    setinnertext(e.target.value);
                                }}
                            />
                            <label for="fileinput">
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    <img
                                        src="https://www.seekpng.com/png/full/406-4063154_image-gallery-landscape-square-potrait-pic-ui-comments.png"
                                        style={{ height: "30px", cursor: "pointer" }}
                                    ></img>
                                    Attach image
                                </div>
                            </label>
                            <input
                                type="file"
                                style={{ display: "none" }}
                                id="fileinput"
                                onChange={(e) => {
                                    setimg(e.target.files[0]);
                                }}
                            ></input>
                        </form>
                        {img ? <img src={img.name}></img> : ""}
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

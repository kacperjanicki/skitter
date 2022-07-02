import React, { useContext, useRef, useState, useEffect } from "react";
import { FloatingLabel, Form, Button, Alert, Modal } from "react-bootstrap";
import { UserProvider } from "../App";
import { writePostData } from "../firebase";
import "./loginpage.css";
import { database, storage } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const PostCreate = () => {
    const { userData, currentUser } = useContext(UserProvider);
    const { setSortMethod, local, postcount, setShow, showModal } = useContext(UserProvider);
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
                // document.getElementById("recent").click();
            } catch (err) {
                setError("");
                setError(String(err));
                console.log(err);
            }
            setLog("Post sent! Your post will show up shortly");
        }
    };
    const handleClose = () => {
        setShow(false);
    };
    var backgroundchoice;
    if (local == "white") {
        backgroundchoice = "#4a4e52";
    } else {
        backgroundchoice = "white";
    }

    return (
        <div className="form">
            {error && (
                <Alert variant="danger" className="alert">
                    {error}
                </Alert>
            )}
            {log && (
                <Alert variant="success" className="alert">
                    {log}
                </Alert>
            )}
            <div className="publish_container" style={{ position: "absolute", left: "200px" }}>
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Body style={{ backgroundColor: backgroundchoice, color: local }}>
                        <form onSubmit={formSubmit} id="postform">
                            <textarea
                                placeholder="What's on your mind?"
                                ref={text}
                                style={{
                                    height: "100px",
                                    width: "100%",
                                    padding: "10px",
                                    backgroundColor: backgroundchoice,
                                    color: local,
                                }}
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
                                    {local == "white" ? (
                                        <img
                                            src="https://www.seekpng.com/png/full/406-4063154_image-gallery-landscape-square-potrait-pic-ui-comments.png"
                                            style={{
                                                height: "30px",
                                                cursor: "pointer",
                                                filter: "invert(100%)",
                                            }}
                                        ></img>
                                    ) : (
                                        <img
                                            src="https://www.seekpng.com/png/full/406-4063154_image-gallery-landscape-square-potrait-pic-ui-comments.png"
                                            style={{
                                                height: "30px",
                                                cursor: "pointer",
                                            }}
                                        ></img>
                                    )}
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
                    <Modal.Footer style={{ backgroundColor: backgroundchoice }}>
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

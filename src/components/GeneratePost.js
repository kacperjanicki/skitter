import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../firebase";
import { ref, get, set, onValue, push } from "firebase/database";
import GenerateNav from "./GenerateNav";
import { AiFillHeart, AiOutlineEye } from "react-icons/ai";
import { BiCommentDetail, BiRepost } from "react-icons/bi";
import { Button, FloatingLabel, Form, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateComments from "./GenerateComments";

const GeneratePost = () => {
    let { id } = useParams();
    const commentRef = useRef();
    const { userData, currentUser, setSortMethod } = useContext(UserProvider);
    const history = useNavigate();
    const count = ref(database, `posts/post${id}`);
    const count2 = ref(database, `posts/post${id}/likes`);
    const [post, setPost] = useState();
    const [error, setError] = useState();
    const [log, setLog] = useState();
    const [likesCount, setLikesCount] = useState();
    const [likesList, setlikesList] = useState();
    // setSortMethod("NEWEST-LATEST");

    useEffect(() => {
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                setPost(snapshot.val());
            }
        });
        get(count2).then((snapshot) => {
            if (snapshot.exists() && userData) {
                var val = snapshot.val();
                if (Object.values(val).includes(userData.username)) {
                    document.getElementById("likebtn").style.color = "red";
                } else {
                    document.getElementById("likebtn").style.color = "white";
                }
            } else if (!snapshot.exists()) {
                set(ref(database, `posts/post${id}/likes`), false);
            }
        });

        onValue(ref(database, `posts/post${id}/likes`), (snapshot) => {
            console.log(snapshot.val());
            setlikesList(Object.values(snapshot.val()));
            setLikesCount(Object.keys(snapshot.val()).length);
        });
    }, []);
    console.log(likesList);

    const handleLike = () => {
        if (currentUser) {
            try {
                set(ref(database, `posts/post${id}/likes/${userData.username}`), userData.username);
            } catch (err) {
                console.log(err);
            }
        } else if (!userData) {
            document.getElementById("likebtn").disabled = true;
        }
    };
    const handleDislike = () => {
        const count = ref(database, `posts/post${id}/likes`);
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                const val = snapshot.val();
                const obj = Object.entries(val);
                const filtered = obj.filter((a) => a[0] != userData.username);

                const final = Object.fromEntries(filtered);
                console.log(final);
                set(count, final);
            }
        });
    };

    const handleComment = (e) => {
        e.preventDefault();
        try {
            setLog("");
            const postListRef = ref(database, `posts/post${id}/comments`);
            const newPostRef = push(postListRef);
            var date = new Date().getTime();
            const date2 = new Date(date);
            set(newPostRef, {
                author: userData.username,
                body: commentRef.current.value,
                prof_pic: userData.profile_picture,
                likes: 0,
                date: date2.toLocaleString("sv"),
            });
            get(count).then((snapshot) => {
                if (snapshot.exists()) {
                    setPost(snapshot.val());
                }
            });
            e.target.reset();
            setLog("Comment added!");
        } catch (err) {
            setError();
            setError(String(err));
            console.log(err);
        }
    };
    var choice;
    if (likesList) {
        if (likesList.includes(userData.username)) {
            choice = "red";
        } else {
            choice = "white";
        }
    }

    // console.log(id);
    return (
        <div style={{ position: "absolute", top: "50px" }}>
            <GenerateNav />
            <div className="profile">
                <div id="left"></div>
                <div id="middle wrap">
                    {post ? (
                        <div className="middle post">
                            <div className="content" style={{ marginLeft: "60px", marginBottom: 0 }}>
                                {post ? post.body : "loading"}
                            </div>
                            <div className="context">
                                <div style={{ display: "flex" }}>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <img
                                            src={post.profile_pic}
                                            style={{ width: "50px", height: "50px", borderRadius: "200px" }}
                                            onMouseOver={(e) => {
                                                document.getElementById("posted").style.fontWeight = 600;
                                                e.target.style.cursor = "pointer";
                                            }}
                                            onMouseOut={() => {
                                                document.getElementById("posted").style.fontWeight = 400;
                                            }}
                                            onClick={() => {
                                                history(`/user/${post.posted_by}`);
                                            }}
                                        ></img>
                                        <span id="posted">{post.posted_by}</span>
                                    </div>

                                    <div
                                        style={{
                                            textAlign: "left",
                                            display: "flex",
                                            gap: "30px",
                                            alignItems: "end",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <button
                                                style={{
                                                    backgroundColor: "#5c84a8",
                                                    color: choice,
                                                    border: "1px solid black",
                                                }}
                                                onClick={(e) => {
                                                    if (userData && currentUser) {
                                                        if (e.target.style.color == "white") {
                                                            handleLike();
                                                            // setlikesList([userData.username]);
                                                            e.target.style.color = "red";
                                                        } else if (e.target.style.color == "red") {
                                                            handleDislike();
                                                            e.target.style.color = "white";
                                                        }
                                                    } else {
                                                        document.getElementById("likebtn").disabled = true;
                                                        alert("Only logged in users can like posts");
                                                    }
                                                }}
                                                id="likebtn"
                                                disabled={false}
                                            >
                                                Like
                                            </button>

                                            {likesCount ? `${likesCount} Likes` : `0 Likes`}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <BiCommentDetail size="20px" />
                                            <button
                                                style={{
                                                    border: "none",
                                                    backgroundColor: "#5c84a8",
                                                    color: "white",
                                                }}
                                            >
                                                {post.comments
                                                    ? `${Object.keys(post.comments).length} Comments`
                                                    : "0 Comments"}
                                            </button>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <button
                                                style={{
                                                    border: "none",
                                                    backgroundColor: "#5c84a8",
                                                    color: "white",
                                                }}
                                                onClick={(e) => {
                                                    if (e.target.style.color == "white") {
                                                        e.target.style.color = "rgb(96, 199, 165)";
                                                    } else {
                                                        e.target.style.color = "white";
                                                    }
                                                }}
                                            >
                                                <BiRepost size="25px" style={{ color: "white" }} />
                                            </button>
                                            0 Reposts
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <button
                                                style={{
                                                    border: "none",
                                                    backgroundColor: "#5c84a8",
                                                    color: "white",
                                                    cursor: "default",
                                                }}
                                            >
                                                <AiOutlineEye size="25px" />
                                            </button>
                                            0 Views
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        "loading"
                    )}

                    <div>
                        <h2>
                            {currentUser ? (
                                "Comments"
                            ) : (
                                <span>
                                    <a href="/login">Log in</a> or <a href="/signup">create an account</a> to
                                    comment
                                </span>
                            )}
                        </h2>
                        <div style={{ width: "60vw" }}>
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
                            <Form className="post-cont" onSubmit={handleComment} id="commentform">
                                <FloatingLabel
                                    controlId="floatingTextarea2"
                                    // label="Add your comment..."
                                    style={{ color: "black" }}
                                />
                                <Form.Control
                                    placeholder="Add your comment"
                                    as="input"
                                    size="lg"
                                    ref={commentRef}
                                    style={{ height: "50px" }}
                                    id="form"
                                    disabled={currentUser ? false : true}
                                />

                                <Button
                                    type="submit"
                                    form="commentform"
                                    disabled={currentUser ? false : true}
                                >
                                    Publish
                                </Button>
                            </Form>
                        </div>
                        <GenerateComments idOfPost={id} />
                    </div>
                </div>
                <div id="right"></div>
            </div>
        </div>
    );
};

export default GeneratePost;

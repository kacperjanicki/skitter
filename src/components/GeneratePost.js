import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../firebase";
import { ref, get, set, onValue, push } from "firebase/database";
import GenerateNav from "./GenerateNav";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { BiCommentDetail, BiRepost } from "react-icons/bi";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateComments from "./GenerateComments";

const GeneratePost = () => {
    let { id } = useParams();
    const commentRef = useRef();
    const { userData, currentUser } = useContext(UserProvider);

    console.log(currentUser);

    const history = useNavigate();
    const count = ref(database, `posts/post${id}`);
    const [post, setPost] = useState();
    useEffect(() => {
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                setPost(snapshot.val());
            }
        });
    }, []);

    const handleComment = (e) => {
        try {
            const postListRef = ref(database, `posts/post${id}/comments`);
            const newPostRef = push(postListRef);
            set(newPostRef, {
                author: userData.username,
                body: commentRef.current.value,
                prof_pic: userData.profile_picture,
                likes: 0,
            });
            e.target.reset();
        } catch (err) {
            console.log(err);
        }
    };

    // console.log(id);
    return (
        <div style={{ position: "absolute", top: "50px" }}>
            <GenerateNav />
            <div className="profile">
                <div id="left"></div>
                <div id="middle wrap">
                    {post ? (
                        <div className="middle post">
                            <div className="content">{post ? post.body : "loading"}</div>
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
                                            alignItems: "center",
                                        }}
                                    >
                                        <div>
                                            <button
                                                style={{ border: "none", backgroundColor: "#5c84a8" }}
                                                onClick={(e) => {
                                                    if (e.target.style.color == "white") {
                                                        e.target.style.color = "red";
                                                    } else {
                                                        e.target.style.color = "white";
                                                    }
                                                }}
                                            >
                                                <AiOutlineHeart size="20px" style={{ color: "white" }} />
                                            </button>
                                            0 Likes
                                        </div>
                                        <div>
                                            <button
                                                style={{
                                                    border: "none",
                                                    backgroundColor: "#5c84a8",
                                                    color: "white",
                                                }}
                                            >
                                                <BiCommentDetail size="20px" />
                                            </button>
                                            0 Comments
                                        </div>
                                        <div>
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
                                                <BiRepost size="30px" style={{ color: "white" }} />
                                            </button>
                                            0 Reposts
                                        </div>
                                        <div>
                                            <button
                                                style={{
                                                    border: "none",
                                                    backgroundColor: "#5c84a8",
                                                    color: "white",
                                                    cursor: "default",
                                                }}
                                            >
                                                <AiOutlineEye size="30px" />
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
                                {/* {error && (
                                <Alert variant="danger" style={{ width: "600px" }}>
                                    {error}
                                </Alert>
                            )}
                            {log && (
                                <Alert variant="success" style={{ width: "600px" }}>
                                    {log}
                                </Alert>
                            )} */}
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

import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../firebase";
import { ref, get, set, onValue, push } from "firebase/database";
import GenerateNav from "./GenerateNav";
import { AiFillHeart, AiOutlineEye } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import { BiCommentDetail, BiRepost } from "react-icons/bi";
import { Button, FloatingLabel, Form, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateComments from "./GenerateComments";

const GeneratePost = () => {
    let { id } = useParams();
    const commentRef = useRef();
    const { userData, currentUser, unsubscribe, shouldChangePostData } = useContext(UserProvider);
    const history = useNavigate();
    const count = ref(database, `posts/post${id}`);
    const count2 = ref(database, `posts/post${id}/likes`);
    const [post, setPost] = useState();
    const [error, setError] = useState();
    const [log, setLog] = useState();
    const [likesCount, setLikesCount] = useState();
    const [likesList, setlikesList] = useState();
    const [likedby, setLiked_by] = useState();
    const [prof_pic, setProfpic] = useState();

    useEffect(() => {
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                var final = snapshot.val();
                get(ref(database, `users/${snapshot.val().posted_by}`)).then((snapshot) => {
                    console.log(snapshot.val());
                    const new_final = { ...final, profile_pic: snapshot.val().profile_picture };
                    setPost(new_final);
                });

                try {
                } catch (err) {
                    console.log(err);
                }

                console.log(snapshot.val());
            }
        });
        get(count2).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                if (Object.keys(val).includes(userData.username)) {
                    document.getElementById("likebtn").style.color = "red";
                } else {
                    document.getElementById("likebtn").style.color = "white";
                }
                console.log(val);

                setLiked_by(val);
            } else if (!snapshot.exists() && Object.keys(snapshot.val()).length > 1) {
                set(ref(database, `posts/post${id}/likes`), false);
            }
        });

        onValue(ref(database, `posts/post${id}/likes`), (snapshot) => {
            console.log(Object.values(snapshot.val()));
            console.log(userData);
            setLiked_by(Object.values(snapshot.val()));

            setlikesList(Object.keys(snapshot.val()));
            setLikesCount(Object.keys(snapshot.val()).length);
        });
    }, []);

    const handleLike = () => {
        if (currentUser) {
            try {
                set(ref(database, `posts/post${id}/likes/${userData.username}`), {
                    name: userData.full_name,
                    pic: userData.profile_picture,
                    username: userData.username,
                });
                get(ref(database, `users/${userData.username}/given_likes`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        set(
                            ref(
                                database,
                                `users/${userData.username}/given_likes/like${
                                    Object.keys(snapshot.val()).length + 1
                                }`
                            ),
                            post
                        );
                    }
                });
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
        get(ref(database, `users/${userData.username}/given_likes`)).then((snapshot) => {
            const obj = Object.entries(snapshot.val());
            const filtered = obj.filter((a) => a[1].id != post.id);
            console.log(filtered);
            if (filtered.length == 0) {
                set(ref(database, `users/${userData.username}/given_likes`), false);
            } else if (filtered.length > 0) {
                set(ref(database, `users/${userData.username}/given_likes`), Object.fromEntries(filtered));
            }
        });
    };

    const handleComment = (e) => {
        e.preventDefault();
        if (commentRef.current.value) {
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
        }
    };
    var choice;
    if (likesList) {
        if (userData) {
            if (likesList.includes(userData.username)) {
                choice = "red";
            } else {
                choice = "white";
            }
        }
    }

    if (document.getElementById("mainpage")) {
        if (localStorage.getItem("mode") == "dark") {
            document.getElementById("mainpage").classList.add("switch");
        }
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div
            className="cont home main"
            id="mainpage"
            style={{ display: "flex", flexDirection: "row", gap: "30px", paddingBottom: "50px" }}
        >
            <GenerateNav />
            <div className="profile">
                <div id="middle wrap">
                    {post ? (
                        <div
                            className="middle post"
                            style={{
                                color: "white",
                                width: "600px",
                                borderBottomLeftRadius: "10px",
                                borderBottomRightRadius: "10px",
                            }}
                        >
                            <div
                                className="content"
                                style={{
                                    marginLeft: "60px",
                                    marginBottom: 0,
                                    textAlign: "left",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    fontSize: 20,
                                }}
                            >
                                {post ? post.body : "loading"}
                                {post.additional ? (
                                    <img
                                        src={post.additional}
                                        style={{ width: "400px", borderRadius: "10px" }}
                                    ></img>
                                ) : (
                                    ""
                                )}
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

                                            {likesCount ? (
                                                <button
                                                    style={{
                                                        color: "white",
                                                        background: "none",
                                                        border: "none",
                                                    }}
                                                    onClick={handleShow}
                                                >
                                                    {likesCount} Likes
                                                </button>
                                            ) : (
                                                `0 Likes`
                                            )}
                                        </div>
                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Liked by</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form>
                                                    <Form.Group className="mb-3">
                                                        {likedby
                                                            ? likedby.map((person) => {
                                                                  get(
                                                                      ref(
                                                                          database,
                                                                          `users/${person.username}`
                                                                      )
                                                                  ).then((snapshot) => {
                                                                      person.pic =
                                                                          snapshot.val().profile_picture;
                                                                  });
                                                                  return (
                                                                      <div
                                                                          style={{
                                                                              display: "flex",
                                                                              gap: "5px",
                                                                              justifyItems: "center",
                                                                              border: "1px solid #dee2e6",
                                                                          }}
                                                                      >
                                                                          <img
                                                                              src={person.pic}
                                                                              style={{
                                                                                  height: "50px",
                                                                                  width: "50px",
                                                                              }}
                                                                              onClick={() => {
                                                                                  history(
                                                                                      `/user/${person.pic}`
                                                                                  );
                                                                              }}
                                                                          />
                                                                          <h5>{person.name}</h5>
                                                                          <br></br>
                                                                          <a
                                                                              href={`/user/${person.username}`}
                                                                          >
                                                                              @{person.username}
                                                                          </a>
                                                                      </div>
                                                                  );
                                                              })
                                                            : ""}
                                                    </Form.Group>
                                                </Form>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
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
                        <div style={{ width: "60vw" }}>
                            {currentUser ? (
                                ""
                            ) : (
                                <div style={{ textAlign: "left", position: "relative", left: 0 }}>
                                    <a href="/login">Log in</a> or <a href="/signup">create an account</a> to
                                    comment
                                </div>
                            )}
                            <span style={{ width: "600px", textAlign: "left" }}>
                                <h2>Comments</h2>
                            </span>

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
                                    style={{ height: "50px", width: "520px" }}
                                    id="form"
                                    disabled={currentUser ? false : true}
                                />

                                <Button type="submit" id="commentform" disabled={currentUser ? false : true}>
                                    Publish
                                </Button>
                            </Form>
                        </div>
                        <GenerateComments idOfPost={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneratePost;

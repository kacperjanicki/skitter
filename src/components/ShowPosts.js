import React, { useContext, useEffect, useState } from "react";
import { ref, get, set, onValue, push } from "firebase/database";
import { database } from "../firebase";

import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";

const SignlePost = (body) => {
    var element = body.body;
    const { userData, currentUser, tweetref } = useContext(UserProvider);
    const history = useNavigate();
    const [likescount, setLikesCount] = useState();
    const [choice, setchoice] = useState();
    useEffect(() => {
        if (currentUser) {
            get(ref(database, `posts/post${element.id}/likes`)).then((snapshot) => {
                if (Object.values(snapshot.val()).includes(userData.username)) {
                    setchoice("red");
                } else if (!Object.values(snapshot.val()).includes(userData.username)) {
                    setchoice("white");
                }
            });
        } else {
            setchoice("white");
        }

        onValue(ref(database, `posts/post${element.id}/likes`), (snapshot) => {
            if (snapshot.exists()) {
                setLikesCount(Object.keys(snapshot.val()).length);
                console.log(Object.values(snapshot.val()).includes(userData.username));
            } else if (!snapshot.exists()) {
                set(ref(database, `posts/post${element.id}/likes`), false);
            }
        });
    }, []);

    function calculateDiff() {
        const start = moment(element.date_in_ms);
        const end = moment(new Date().getTime());
        const diff = end.diff(start);

        //express as a duration
        const diffDuration = moment.duration(diff);

        // display
        const days = diffDuration.days();
        const hours = diffDuration.hours();
        const minutes = diffDuration.minutes();

        if (days < 1 && hours > 1) {
            return `${hours}hr, ${minutes}m ago`;
        } else if (days < 1 && hours < 1) {
            return `${minutes} minutes ago`;
        } else if (days >= 1) {
            return `${days} day ago`;
        }
    }

    const handleLike = (e) => {
        let id = element.id;
        if (currentUser) {
            try {
                const count = ref(database, `posts/post${id}/likes/`);
                const newlike = push(count);
                set(ref(database, `posts/post${id}/likes/${userData.username}`), userData.username);
            } catch (err) {
                console.log(err);
            }
        } else if (!userData) {
            document.getElementById("likebtn").disabled = true;
        }
    };
    const handleDislike = () => {
        const count = ref(database, `posts/post${element.id}/likes`);
        if (currentUser) {
            get(count).then((snapshot) => {
                if (snapshot.exists()) {
                    const val = snapshot.val();
                    const obj = Object.entries(val);
                    const filtered = obj.filter((a) => a[0] != userData.username);

                    const final = Object.fromEntries(filtered);
                    setLikesCount(filtered.length);
                    console.log(final);
                    set(count, final);
                    if (final.length == 0) {
                        set(count, false);
                    }
                }
            });
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }} ref={tweetref}>
            <div className="tweet" id="tweetsingle" style={{ borderBottom: 0 }}>
                <div className="img_place">
                    {element.profile_pic ? (
                        <>
                            <img
                                src={element.profile_pic}
                                onClick={() => {
                                    history(`/user/${element.posted_by}`);
                                }}
                            />
                            <div className="footer">
                                {element.posted_by}
                                <br />
                                {calculateDiff()}
                            </div>
                        </>
                    ) : (
                        <img
                            src={require("./placeholder.jpg")}
                            onClick={() => {
                                history(`/user/${element.posted_by}`);
                            }}
                        />
                    )}
                </div>
                <div className="body" onClick={() => history(`/post/${element.id}`)}>
                    <div className="text">{element.body}</div>
                </div>
            </div>
            <div style={{ border: "1px solid black", textAlign: "left", width: "600px" }}>
                <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                    <div>
                        <button
                            style={{ background: "none", border: "none" }}
                            color="white"
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
                        >
                            <AiOutlineHeart id="likebtn" size="20px" style={{ color: choice }} />
                        </button>
                        {likescount ? likescount : "0"}
                    </div>
                    <div>
                        <button
                            style={{
                                border: "none",
                                background: "none",
                                color: "white",
                            }}
                            onClick={async () => {
                                await history(`/post/${element.id}`);
                                if (currentUser) {
                                    document.querySelector("#form").focus();
                                }
                            }}
                        >
                            <BiCommentDetail size="20px" />
                        </button>
                        0 Comments
                    </div>
                    <div>0 Reposts</div>
                </div>
            </div>
        </div>
    );
};

const ShowPosts = (person, id) => {
    const { single_posts, sortMethod, setSortMethod } = useContext(UserProvider);

    var gowno;
    console.log(sortMethod);
    if (!sortMethod) {
        gowno = single_posts;
    }
    if (sortMethod == "NEWEST-LATEST") {
        gowno = single_posts.sort((a, b) => b.date_in_ms - a.date_in_ms);
    }
    if (sortMethod == "LATEST-NEWEST") {
        gowno = single_posts.sort((a, b) => a.date_in_ms - b.date_in_ms);
    }
    if (sortMethod == "BY_USR") {
        gowno = single_posts.filter((e) => e.posted_by == person.person);
    }

    return (
        <div className="tweets" id="alltweets">
            {gowno.map((element) => {
                return <SignlePost body={element} key={element.id} />;
            })}
        </div>
    );
};

export default ShowPosts;

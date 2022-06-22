import React, { useContext, useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";

const SignlePost = (body) => {
    var element = body.body;
    const { userData, currentUser } = useContext(UserProvider);
    const history = useNavigate();
    // console.log(element);

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
    const giveLike = (e) => {
        if (e.target.style.color == "white") {
            e.target.style.color = "red";
        } else {
            e.target.style.color = "white";
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
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
                        <button style={{ background: "none", border: "none" }} onClick={giveLike}>
                            <AiOutlineHeart size="20px" style={{ color: "white" }} />
                        </button>
                        0
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
    console.log(single_posts[id + 1]);
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
    // setSortMethod();
    // else if(sortMethod == 'BY_USR_NAME'){
    //     gowno = single_posts.filter((person)=>person.posted_by)
    // }
    return (
        <div className="tweets" id="alltweets">
            {gowno.map((element) => {
                return <SignlePost body={element} key={element.id} />;
            })}
        </div>
    );
};

export default ShowPosts;

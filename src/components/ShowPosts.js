import React, { useContext, useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";

const SignlePost = (body) => {
    var element = body.body;
    const { userData } = useContext(UserProvider);
    const history = useNavigate();
    // console.log(element);

    function calculateDiff() {
        const start = element.date_in_ms;
        const end = new Date().getTime();
        const diff = end - start;
        var diff_as_date = new Date(diff);
        if (diff_as_date.getHours() - 1 >= 1) {
            return `${diff_as_date.getHours()} hr ago`;
        } else if (diff_as_date.getHours() - 1 < 1) {
            return `${diff_as_date.getMinutes()} minutes ago`;
        }
    }

    return (
        <div className="tweet">
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
                            Posted by: {element.posted_by}
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
            <div className="body">
                <div className="text">{element.body}</div>
            </div>
        </div>
    );
};

const ShowPosts = (person) => {
    const { single_posts, sortMethod } = useContext(UserProvider);
    // console.log(single_posts);
    // let gowno = single_posts.sort((a, b) => b.date_in_ms - a.date_in_ms); //od najnowszych
    // console.log(sortMethod);
    var gowno;
    if (!sortMethod) {
        gowno = single_posts;
    } else if (sortMethod == "NEWEST-LATEST") {
        gowno = single_posts.sort((a, b) => b.date_in_ms - a.date_in_ms);
    } else if (sortMethod == "LATEST-NEWEST") {
        gowno = single_posts.sort((a, b) => a.date_in_ms - b.date_in_ms);
    } else if (sortMethod == "BY_USR") {
        gowno = single_posts.filter((e) => e.posted_by == person.person);
    }
    // else if(sortMethod == 'BY_USR_NAME'){
    //     gowno = single_posts.filter((person)=>person.posted_by)
    // }

    return (
        <div className="tweets">
            {gowno.map((element) => {
                return <SignlePost body={element} key={element.id} />;
            })}
        </div>
    );
};

export default ShowPosts;

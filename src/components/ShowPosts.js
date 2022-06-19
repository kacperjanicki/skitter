import React, { useContext, useEffect, useState } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { Card, Container } from "react-bootstrap";
import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";

const SignlePost = (body) => {
    var element = body.body;
    const { userData } = useContext(UserProvider);
    const history = useNavigate();
    console.log(element);

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
                    <img
                        src={element.profile_pic}
                        onClick={() => {
                            history(`/user/${element.posted_by}`);
                        }}
                    />
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
                <div className="footer">
                    Posted by: {element.posted_by}
                    <br />
                    {calculateDiff()}
                </div>
            </div>
        </div>
    );
};

const ShowPosts = () => {
    const postlist = ref(database, "posts/");
    const [posts, setPosts] = useState();

    useEffect(() => {
        onValue(postlist, (snapshot) => {
            setPosts(snapshot.val());
        });
    }, []);

    var destination = {};
    var single_posts = [];
    Object.assign(destination, posts);

    var keys = Object.keys(destination);
    for (let i = 0; i < keys.length; i++) {
        single_posts.push(destination[keys[i]]);
    }

    return (
        <div className="tweets">
            {single_posts.map((element) => {
                return <SignlePost body={element} key={element.id} />;
            })}
        </div>
    );
};

export default ShowPosts;

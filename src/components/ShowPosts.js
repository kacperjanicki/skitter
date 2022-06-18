import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { Card, Container } from "react-bootstrap";

const SignlePost = (body) => {
    var element = body.body;
    return (
        <div className="tweet">
            <div className="img_place">
                <img src={require("./placeholder.jpg")}></img>
            </div>
            <div className="body">
                <div className="text">{element.body}</div>
                <div className="footer">Posted by: {element.posted_by}</div>
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
    console.log(single_posts);

    return (
        <>
            {single_posts.map((element) => {
                return <SignlePost body={element} />;
            })}
        </>
    );
};

export default ShowPosts;

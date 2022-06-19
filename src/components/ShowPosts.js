import React, { useContext, useEffect, useState } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { Card, Container } from "react-bootstrap";
import { UserProvider } from "../App";

const SignlePost = (body) => {
    var element = body.body;
    const { userData } = useContext(UserProvider);
    console.log(element);

    return (
        <div className="tweet">
            <div className="img_place">
                {element.profile_pic ? (
                    <img src={element.profile_pic} />
                ) : (
                    <img src={require("./placeholder.jpg")} />
                )}
            </div>
            <div className="body">
                <div className="text">{element.body}</div>
                <div className="footer">
                    Posted by: {element.posted_by}
                    <br />
                    Published on: {element.published_on}
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
        <>
            {single_posts.map((element) => {
                return <SignlePost body={element} key={element.id} />;
            })}
        </>
    );
};

export default ShowPosts;

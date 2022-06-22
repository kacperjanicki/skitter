import React from "react";
import { useContext } from "react";
import { UserProvider } from "../App";
import SingleComment from "./SingleComment";

const GenerateComments = (idOfPost) => {
    const post_id = idOfPost.idOfPost;
    const { single_posts } = useContext(UserProvider);
    const found_post = single_posts.filter((a) => a.id == post_id);
    var container = [];

    found_post.map((element) => {
        //   console.log(element.comments);
        const len = Object.keys(element.comments).length;

        Object.entries(element.comments).map((element) => {
            container.push(element[1]);
        });
        return container;
    });

    return (
        <div>
            {container.map((element) => {
                return <SingleComment data={element} />;
            })}
        </div>
    );
};

export default GenerateComments;

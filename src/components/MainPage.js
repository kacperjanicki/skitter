import React, { useContext } from "react";
import { UserProvider } from "../App";
import GenerateNav from "./GenerateNav";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import PostCreate from "./PostCreate";
import ShowPosts from "./ShowPosts";
import { AiOutlineGithub } from "react-icons/ai";

const MainPage = () => {
    const { userData, setSortMethod, currentUser, tweetref, local, setlocal, darkMode } =
        useContext(UserProvider);
    const history = useNavigate();

    return (
        <>
            <div
                className="cont home main"
                id="mainpage"
                style={{ display: "flex", flexDirection: "row", gap: "30px", width: "600px" }}
            >
                <GenerateNav />
                <div>
                    <PostCreate />
                    <ShowPosts />
                </div>
            </div>
        </>
    );
};

export default MainPage;

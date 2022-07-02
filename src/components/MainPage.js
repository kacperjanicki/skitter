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
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        fontSize: "20px",
                        color: local,
                        opacity: "0.4",
                        padding: "10px",
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        window.open("https://github.com/kacperjanicki");
                    }}
                >
                    <AiOutlineGithub size={40} className="github" />
                    <span className="github"> github/kacperjanicki</span>
                </div>
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

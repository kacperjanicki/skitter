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
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 5,
                            fontSize: "20px",
                            color: local,
                            opacity: "0.4",
                            padding: "10px",
                            zIndex: 5,

                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            window.open("https://github.com/kacperjanicki");
                        }}
                    >
                        <AiOutlineGithub size={30} className="github" />
                    </div>
                    <PostCreate />
                    <ShowPosts />
                </div>
            </div>
        </>
    );
};

export default MainPage;

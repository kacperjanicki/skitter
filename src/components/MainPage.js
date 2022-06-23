import React, { useContext, useEffect, useState } from "react";
import { Container, Navbar, Nav, FloatingLabel, Form, Button, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateNav from "./GenerateNav";
import { writePostData } from "../firebase";
import "./loginpage.css";
import PostCreate from "./PostCreate";
import ShowPosts from "./ShowPosts";

const MainPage = () => {
    const { userData, setSortMethod, currentUser, tweetref, local, setlocal } = useContext(UserProvider);
    // console.log(NodeList(tweetref.current));

    const darkMode = () => {
        if (document.getElementById("mainpage").classList.contains("switch")) {
            document.getElementById("mainpage").classList.remove("switch");
            document.getElementById("button").innerHTML = "Light theme";
            localStorage.setItem("mode", "light");
        } else {
            document.getElementById("mainpage").classList.add("switch");
            document.getElementById("button").innerHTML = "Dark theme";
            tweetref.current.classList.add("tweetswitch");
            localStorage.setItem("mode", "dark");
        }
        console.log(localStorage.getItem("mode"));
        if (localStorage.getItem("mode") == "dark") {
            setlocal("white");
        } else if (localStorage.getItem("mode") == "light") {
            setlocal("black");
        }
    };
    useEffect(() => {
        setSortMethod("NEWEST-LATEST");

        if (localStorage.getItem("mode") == "dark") {
            document.getElementById("mainpage").classList.add("switch");
            document.getElementById("button").innerHTML = "Dark theme";
        } else if (localStorage.getItem("mode") == "light") {
            document.getElementById("mainpage").classList.remove("switch");
            document.getElementById("button").innerHTML = "Light theme";
        }
        if (localStorage.getItem("mode") == "dark") {
            setlocal("white");
        } else if (localStorage.getItem("mode") == "light") {
            setlocal("black");
        }
    }, []);

    return (
        <>
            <div style={{ position: "absolute", top: "50px", right: 0, zIndex: 5 }}>
                <Button id="button" onClick={darkMode}>
                    Light theme
                </Button>
            </div>
            <GenerateNav />
            <div className="cont home main" id="mainpage">
                <div>
                    <PostCreate />
                    <ShowPosts />
                </div>
            </div>
        </>
    );
};

export default MainPage;

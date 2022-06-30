import React, { useContext, useEffect, useState } from "react";
import { Container, Navbar, Nav, FloatingLabel, Form, Button, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateNav from "./GenerateNav";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import PostCreate from "./PostCreate";
import ShowPosts from "./ShowPosts";

const MainPage = () => {
    const { userData, setSortMethod, currentUser, tweetref, local, setlocal, darkMode } =
        useContext(UserProvider);

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

import React, { useContext, useState } from "react";
import { Container, Navbar, Nav, FloatingLabel, Form, Button, Alert } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateNav from "./GenerateNav";
import { writePostData } from "../firebase";
import "./loginpage.css";
import PostCreate from "./PostCreate";
import ShowPosts from "./ShowPosts";

const MainPage = () => {
    const { userData } = useContext(UserProvider);

    return (
        <>
            <GenerateNav />
            <div className="cont home">
                <div>
                    <PostCreate />
                    <ShowPosts />
                </div>
            </div>
        </>
    );
};

export default MainPage;

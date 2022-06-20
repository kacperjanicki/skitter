import React from "react";
import { useNavigate } from "react-router-dom";

//redirects you to home when you visit '/' route
const BasicPage = () => {
    const history = useNavigate();
    history("/home");
    return <div></div>;
};

export default BasicPage;

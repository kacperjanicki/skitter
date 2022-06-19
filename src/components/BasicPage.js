import React from "react";
import { useNavigate } from "react-router-dom";

const BasicPage = () => {
    const history = useNavigate();
    history("/home");
    return <div></div>;
};

export default BasicPage;

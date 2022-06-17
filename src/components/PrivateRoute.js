import React, { useContext } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { Route, Navigate, Outlet } from "react-router-dom";
import { UserProvider } from "../App";

const PrivateRoute = () => {
    const { currentUser } = useContext(UserProvider);

    return currentUser ? (
        <Outlet />
    ) : (
        <>
            <Navigate to="/login" />
            {alert("you have to log in to access this page")}
        </>
    );
};

export default PrivateRoute;

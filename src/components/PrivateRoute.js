import React, { useContext } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { Route, Navigate, Outlet } from "react-router-dom";
import { UserProvider } from "../App";
import { useEffect } from "react";
import { auth } from "../firebase";

const PrivateRoute = () => {
    const { currentUser, setcurrentUser, setLoading } = useContext(UserProvider);

    return currentUser ? (
        <Outlet />
    ) : (
        <>
            <Navigate to="/login" />
        </>
    );
};

export default PrivateRoute;

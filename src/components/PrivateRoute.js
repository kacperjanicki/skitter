import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserProvider } from "../App";

const PrivateRoute = () => {
    const { currentUser } = useContext(UserProvider);

    return currentUser ? <Outlet /> : <>{<Navigate to="/login" />}</>;
};

export default PrivateRoute;

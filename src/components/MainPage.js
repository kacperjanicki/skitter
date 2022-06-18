import React, { useContext } from "react";
import { UserProvider } from "../App";

const MainPage = () => {
    const { userData } = useContext(UserProvider);
    return <>{userData ? `You are logged in as ${userData.full_name}` : "you are not logged in"}</>;
};

export default MainPage;

import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";
import GenerateNav from "./GenerateNav";
import { Card, Button } from "react-bootstrap";

const ProfilePage = () => {
    const { userData } = useContext(UserProvider);
    let { username } = useParams();
    const history = useNavigate();
    if (userData) {
        console.log(userData.username);
        console.log(username);
        if (userData.username == username) {
            history("/profile");
        }
    }

    return (
        <>
            <GenerateNav />
            <div class="cont home profile">
                <Card style={{ width: "40rem" }}>
                    <Card.Body>{username}</Card.Body>
                </Card>
            </div>
        </>
    );
};

export default ProfilePage;

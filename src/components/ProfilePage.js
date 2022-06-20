import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";
import GenerateNav from "./GenerateNav";
import { Card, Button } from "react-bootstrap";
import { checkuser } from "../firebase";
import { database } from "../firebase";
import { ref, set } from "firebase/database";
import { onValue, get, child } from "firebase/database";
import ShowPosts from "./ShowPosts";

const ProfilePage = () => {
    const { userData, setSortMethod } = useContext(UserProvider);
    let { username } = useParams();
    const history = useNavigate();
    setSortMethod("BY_USR");

    if (userData) {
        console.log(userData.username);
        console.log(username);
        if (userData.username == username) {
            history("/profile");
        }
    }

    const postlist = ref(database, "users/");
    const [userobj, setuserobj] = useState();

    const handleFollow = () => {
        const count = ref(database, `users/${username}/followers`);
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                set(ref(database, `users/${username}/followers/${userData.username}`), {
                    //drop a follow to sb
                    name: userData.username,
                });
            }
        });
    };

    useEffect(() => {
        const url = "https://skitter-9e5e3-default-rtdb.europe-west1.firebasedatabase.app/users.json";
        const fetchdata = async () => {
            const data = await fetch(url);
            const json = await data.json();
            setuserobj(json[username]);
        };
        fetchdata();
    }, []);

    // console.log(userobj);
    return (
        <>
            {userobj ? (
                <div style={{ position: "absolute", top: "50px" }}>
                    <GenerateNav />
                    <div className="profile">
                        <div id="left"></div>
                        <div id="middle wrap">
                            <div id="middle">
                                <img
                                    src={userobj.profile_picture}
                                    style={{ width: "200px", height: "200px", borderRadius: "200px" }}
                                />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span className="text-left">
                                        <strong id="txt">{userobj.full_name}</strong>
                                        <span>@{userobj.username}</span>
                                    </span>
                                    <span className="text-left">
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <span>
                                                    <strong>0</strong> follower(s)
                                                </span>
                                                <span>
                                                    <strong>0</strong> following
                                                </span>

                                                {/* <div>
                                                <Button variant="secondary" size="sm">
                                                    Edit profile
                                                </Button>
                                            </div> */}
                                            </div>
                                            <div>Bio placeholder</div>
                                        </div>
                                    </span>
                                    <span>Joined xx.xx.xxxx</span>
                                    {userData ? (
                                        <Button onClick={handleFollow}>Follow</Button>
                                    ) : (
                                        <Button disabled>Follow (You need to log in)</Button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h1>{userobj.first_name}s' posts</h1>
                                <div className="post-cont">
                                    <ShowPosts person={userobj.username} />
                                </div>
                            </div>
                        </div>
                        <div id="right"></div>
                    </div>
                </div>
            ) : (
                "loading"
            )}
        </>
    );
};

export default ProfilePage;

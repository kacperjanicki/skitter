import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";
import GenerateNav from "./GenerateNav";
import { Button } from "react-bootstrap";

import { database } from "../firebase";
import { ref, set } from "firebase/database";
import { onValue, get } from "firebase/database";
import ShowPosts from "./ShowPosts";

const ProfilePage = () => {
    const { userData, setSortMethod, currentUser } = useContext(UserProvider);
    let { username } = useParams();
    const history = useNavigate();
    setSortMethod("BY_USR");
    console.log(userData);
    console.log(currentUser);
    if (userData) {
        if (userData.username == username && currentUser != null) {
            history("/profile");
        }
    }
    const [follower_count, setFollower_count] = useState();
    const [count, setcount] = useState();
    const [bio, setBio] = useState();
    useEffect(() => {
        const count = ref(database, `users/${username}/followers`);
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                setFollower_count(snapshot.val());
                setcount(Object.keys(snapshot.val()).length);
            }
        });
        get(ref(database, `users/${username}/bio`)).then((snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.val() == false) {
                    setBio("No bio");
                } else {
                    setBio(snapshot.val());
                }
            }
        });
    }, []);
    var isBeingFollowed = false;
    if (follower_count && userData) {
        var followers_num = Object.keys(follower_count).length;
        if (Object.keys(follower_count).includes(userData.username)) {
            isBeingFollowed = true;
        }
        console.log(Object.keys(follower_count));
    }

    const [userobj, setuserobj] = useState();
    const [following, setfollowing] = useState();

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
        onValue(ref(database, `users/${username}/followers`), (snapshot) => {
            const data = snapshot.val();
            setcount(Object.keys(data).length);
            // isBeingFollowed = true;
            setfollowing(true);
        });
    };
    const handleunFollow = () => {
        const count = ref(database, `users/${username}/followers`);
        get(count).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                const asArr = Object.entries(val);
                const filtered = asArr.filter((a) => a[0] != userData.username);
                const final = Object.fromEntries(filtered);

                if (Object.keys(final).length == 0) {
                    set(ref(database, `users/${username}/followers`), false);
                } else {
                    set(ref(database, `users/${username}/followers`), final);
                }
                onValue(ref(database, `users/${username}/followers`), (snapshot) => {
                    const data = snapshot.val();
                    setcount(Object.keys(data).length);
                    // isBeingFollowed = false;
                    setfollowing(false);
                });
            }
        });
        console.log(isBeingFollowed);
    };
    console.log(username);
    useEffect(() => {
        const url = "https://skitter-9e5e3-default-rtdb.europe-west1.firebasedatabase.app/users.json";
        const fetchdata = async () => {
            const data = await fetch(url);
            const json = await data.json();
            setuserobj(json[username]);
        };
        fetchdata();
    }, []);

    return (
        <>
            {userobj ? (
                <div style={{ position: "absolute", top: "50px" }}>
                    <GenerateNav />
                    <div className="profile">
                        <div id="left"></div>
                        <div id="middle wrap">
                            <div className="middle">
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
                                                    {count ? (
                                                        <>
                                                            <strong>{count}</strong> follower(s)
                                                        </>
                                                    ) : (
                                                        <>
                                                            <strong>0</strong> follower(s)
                                                        </>
                                                    )}
                                                </span>
                                                <span>
                                                    <strong>0</strong> following
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: "20px" }}>{bio}</div>
                                    </span>
                                    {userobj.when_joined ? ( //usun to potem
                                        <span>Joined: {userobj.when_joined}</span>
                                    ) : (
                                        <span>Joined: data not given</span>
                                    )}

                                    {(() => {
                                        if (currentUser == null) {
                                            return <Button disabled>Follow (You need to log in)</Button>;
                                        } else if (isBeingFollowed) {
                                            return <Button onClick={handleunFollow}>Unfollow</Button>;
                                        } else {
                                            if (userData && following) {
                                                return <Button onClick={handleunFollow}>Unfollow</Button>;
                                            } else if (userData && !following) {
                                                return <Button onClick={handleFollow}>Follow</Button>;
                                            } else if (userData) {
                                                return <Button onClick={handleFollow}>Follow</Button>;
                                            }
                                        }
                                    })()}
                                </div>
                            </div>

                            <div>
                                <h1>{userobj.first_name}'s posts</h1>
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

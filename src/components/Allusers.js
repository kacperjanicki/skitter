import React, { useContext, useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";
import { TbArrowBackUp } from "react-icons/tb";

const Allusers = () => {
    const [users, setUsers] = useState();
    const { local } = useContext(UserProvider);
    const navigate = useNavigate();
    useEffect(() => {
        get(ref(database, "users")).then((snapshot) => {
            setUsers(snapshot.val());
            console.log(users);
        });
    }, []);
    if (document.getElementById("mainpage")) {
        if (localStorage.getItem("mode") == "dark") {
            document.getElementById("mainpage").classList.add("switch");
        }
    }

    return (
        <div id="mainpage" style={{ height: "100vh" }}>
            {users && (
                <div>
                    <div style={{ width: "100vw", textAlign: "center" }}>
                        <button
                            style={{
                                color: "white",
                                border: "none",
                                width: "80%",
                                padding: "5px",
                                marginBottom: "10px",
                                borderRadius: "30px",
                                background: "#5c636a",
                            }}
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "5px",
                                }}
                            >
                                <TbArrowBackUp />
                                Back
                            </div>
                        </button>
                    </div>

                    {Object.values(users).map((element) => (
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                border: "1px solid #dee2e6",

                                position: "relative",
                            }}
                            id="allusr"
                        >
                            <div>
                                <img
                                    src={element.profile_picture}
                                    style={{ width: "100px", height: "100px" }}
                                    onClick={() => {
                                        navigate(`/user/${element.username}`);
                                    }}
                                ></img>
                                <div>{element.full_name}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {element.bio ? element.bio : "No bio given"}
                                <span>
                                    Go to <a href={`/user/${element.username}`}>{element.first_name}</a>{" "}
                                    profile
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Allusers;

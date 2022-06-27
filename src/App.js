import "./components/loginpage.css";
import LoginPage from "./components/signup";
import BasicPage from "./components/BasicPage";
import ProfilePage from "./components/ProfilePage";
import React, { useState, useEffect, useRef } from "react";
import { auth } from "./firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Edit from "./components/Edit";
import Dashboard from "./components/dashboard";
import ActualLogin from "./components/login";
import PrivateRoute from "./components/PrivateRoute";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import Forgot from "./components/Forgot";
import MainPage from "./components/MainPage";
import GeneratePost from "./components/GeneratePost";
export const UserProvider = React.createContext();

function App() {
    const [currentUser, setcurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setuserData] = useState();

    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };
    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    };
    const resetpass = (email) => {
        return auth.sendPasswordResetEmail(email);
    };
    const logout = () => {
        return auth.signOut();
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setcurrentUser(user);
            setLoading(false);
            const url = "https://skitter-9e5e3-default-rtdb.europe-west1.firebasedatabase.app/users.json";
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    const currentObj = Object.values(data).find((obj) => obj.email === user.email);
                    if (currentObj) {
                        setuserData(currentObj);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        return unsubscribe;
    }, []);
    const postlist = ref(database, "posts/");
    const [posts, setPosts] = useState();
    useEffect(() => {
        onValue(postlist, (snapshot) => {
            setPosts(snapshot.val());
        });
    }, []);
    var destination = {};
    var single_posts = [];
    Object.assign(destination, posts);
    var keys = Object.keys(destination);
    for (let i = 0; i < keys.length; i++) {
        single_posts.push(destination[keys[i]]);
    }
    const darkMode = () => {
        if (document.getElementById("mainpage").classList.contains("switch")) {
            document.getElementById("mainpage").classList.remove("switch");
            document.getElementById("modeswitch").innerHTML = "Light theme";
            localStorage.setItem("mode", "light");
        } else {
            document.getElementById("mainpage").classList.add("switch");
            document.getElementById("modeswitch").innerHTML = "Dark theme";
            tweetref.current.classList.add("tweetswitch");
            localStorage.setItem("mode", "dark");
        }
        console.log(localStorage.getItem("mode"));
        if (localStorage.getItem("mode") == "dark") {
            setlocal("white");
        } else if (localStorage.getItem("mode") == "light") {
            setlocal("black");
        }
    };

    useEffect(() => {
        console.log(local);
        if (document.getElementById("mainpage")) {
            if (localStorage.getItem("mode") == "dark") {
                document.getElementById("mainpage").classList.add("switch");
            } else if (localStorage.getItem("mode") == "light") {
                document.getElementById("mainpage").classList.remove("switch");
            }
            if (localStorage.getItem("mode") == "dark") {
                setlocal("white");
            } else if (localStorage.getItem("mode") == "light") {
                setlocal("black");
            }
        }
    }, []);

    const [sorted_arr, setSorted_arr] = useState();
    const [sortMethod, setSortMethod] = useState();
    const [local, setlocal] = useState();
    const tweetref = useRef();
    const [showModal, setShow] = useState(false);
    const [displayType, setdisplayType] = useState();

    const value = {
        currentUser,
        showModal,
        displayType,
        setdisplayType,
        darkMode,
        setShow,
        local,
        setlocal,
        tweetref,
        sortMethod,
        setSortMethod,
        userData,
        setuserData,
        setcurrentUser,
        resetpass,
        signup,
        login,
        single_posts,
        sorted_arr,
        setSorted_arr,
        logout,
        loading,
        setLoading,
    };

    return (
        <UserProvider.Provider value={value}>
            <Router>
                <Routes>
                    <Route exact path="/profile" element={<PrivateRoute />}>
                        <Route exact path="/profile" element={<Dashboard />} />
                        <Route exact path="/profile/edit" element={<Edit />} />
                    </Route>
                    <Route exact path="/" element={<BasicPage />}></Route>
                    <Route path="/user/:username" element={<ProfilePage />}></Route>
                    <Route path="/post/:id" element={<GeneratePost />}></Route>
                    <Route exact path="/home" element={<MainPage />} />

                    <Route path="/signup" element={<LoginPage />}></Route>
                    <Route path="/login" exact element={<ActualLogin />}></Route>
                    <Route path="/forgot-password" exact element={<Forgot />}></Route>
                </Routes>
            </Router>
        </UserProvider.Provider>
    );
}

export default App;

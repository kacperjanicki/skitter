import "./components/loginpage.css";
import LoginPage from "./components/signup";
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ActualLogin from "./components/login";
import PrivateRoute from "./components/PrivateRoute";
import Forgot from "./components/Forgot";
import MainPage from "./components/MainPage";
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

    console.log(userData);

    const value = {
        currentUser,
        userData,
        setuserData,
        setcurrentUser,
        resetpass,
        signup,
        login,
        logout,
        loading,
        setLoading,
    };
    console.log(userData);
    return (
        <UserProvider.Provider value={value}>
            <Router>
                <Routes>
                    <Route exact path="/profile" element={<PrivateRoute />}>
                        <Route exact path="/profile" element={<Dashboard />} />
                    </Route>

                    <Route exact path="/home" element={<MainPage />} />

                    <Route path="/signup" exact element={<LoginPage />}></Route>
                    <Route path="/login" exact element={<ActualLogin />}></Route>
                    <Route path="/forgot-password" exact element={<Forgot />}></Route>
                </Routes>
            </Router>
        </UserProvider.Provider>
    );
}

export default App;

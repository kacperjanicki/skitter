import "./components/loginpage.css";
import LoginPage from "./components/signup";
import React, { useContext, useRef, useState, useEffect } from "react";
import { auth } from "./firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ActualLogin from "./components/login";
import PrivateRoute from "./components/PrivateRoute";
import Forgot from "./components/Forgot";
export const UserProvider = React.createContext();

function App() {
    const [currentUser, setcurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            console.log(user);
            setcurrentUser(user);
            // setcurrentUser(JSON.parse(localStorage.getItem("user")));
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        setcurrentUser,
        resetpass,
        signup,
        login,
        logout,
        loading,
        setLoading,
    };

    return (
        <UserProvider.Provider value={value}>
            <Router>
                <Routes>
                    <Route exact path="/" element={<PrivateRoute />}>
                        <Route exact path="/" element={<Dashboard />} />
                    </Route>
                    <Route path="/signup" exact element={<LoginPage />}></Route>
                    <Route path="/login" exact element={<ActualLogin />}></Route>
                    <Route path="/forgot-password" exact element={<Forgot />}></Route>
                </Routes>
            </Router>
        </UserProvider.Provider>
    );
}

export default App;

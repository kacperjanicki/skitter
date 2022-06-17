import "./components/loginpage.css";
import LoginPage from "./components/LoginPage";
import React, { useContext, useRef, useState, useEffect } from "react";
import { auth } from "./firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export const UserProvider = React.createContext();

function App() {
    const [currentUser, setcurrentUser] = useState();

    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setcurrentUser(user);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
    };

    return (
        <UserProvider.Provider value={value}>
            <Router>
                <Routes>
                    <Route path="/" exact element={<LoginPage />}></Route>
                </Routes>
            </Router>
        </UserProvider.Provider>
    );
}

export default App;

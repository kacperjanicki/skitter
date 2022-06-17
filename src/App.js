import "./components/loginpage.css";
import LoginPage from "./components/signup";
import React, { useContext, useRef, useState, useEffect } from "react";
import { auth } from "./firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ActualLogin from "./components/login";
import PrivateRoute from "./components/PrivateRoute";

export const UserProvider = React.createContext();

// export function useAuth() {
//     return useContext(UserProvider);
// }

function App() {
    const [currentUser, setcurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    };

    const logout = () => {
        return auth.signOut();
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setcurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        loading,
        setLoading,
    };
    console.log(loading);

    return (
        <UserProvider.Provider value={value}>
            <Router>
                <Routes>
                    <Route exact path="/" element={<PrivateRoute />}>
                        <Route exact path="/" element={<Dashboard />} />
                    </Route>
                    <Route path="/signup" exact element={<LoginPage />}></Route>
                    <Route path="/login" exact element={<ActualLogin />}></Route>
                </Routes>
            </Router>
        </UserProvider.Provider>
    );
}

export default App;

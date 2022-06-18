import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    databaseURL: "https://skitter-9e5e3-default-rtdb.europe-west1.firebasedatabase.app/",
});

export const auth = app.auth();
export default app;

export const database = getDatabase(app);
export function writeUserData(username, email, firstname, lastname, imageUrl) {
    set(ref(database, "users/" + username), {
        username: username,
        first_name: firstname,
        last_name: lastname,
        full_name: `${firstname} ${lastname}`,
        email: email,
        profile_picture: imageUrl,
    });
}

// writeUserData("123", "ziomek", "ziomek@gmail.com", "jakislink");

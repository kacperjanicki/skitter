import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, set, onValue, serverTimestamp, get } from "firebase/database";

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
export function writeUserData(
    username,
    email,
    firstname,
    lastname,
    imageUrl,
    date,
    followers,
    following,
    bio
) {
    var date = new Date();
    var result = date.toLocaleDateString("pl-PL", {
        // you can use undefined as first argument
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    set(ref(database, "users/" + username), {
        username: username,
        first_name: firstname,
        last_name: lastname,
        full_name: `${firstname} ${lastname}`,
        email: email,
        dateBirth: date,
        profile_picture: imageUrl,
        followers: followers,
        following: following,
        bio: bio,
        when_joined: result,
    });
}

const count = ref(database, "postcount/count");
var data;
onValue(count, (snapshot) => {
    data = snapshot.val();
});

export function writePostData(username, body, pic) {
    set(ref(database, "/postcount"), {
        count: data + 1,
    });
    // var pic = profile(username);
    var date = new Date().getTime();
    const date2 = new Date(date);
    set(ref(database, `posts/post${data}`), {
        id: data,
        published_on: date2.toLocaleString("sv"),
        date_in_ms: date,
        posted_by: username,
        body: body,
        profile_pic: pic,
        comments: false,
        likes: false,
        views: false,
    });
}

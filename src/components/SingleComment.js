import React, { useContext } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../App";

const SingleComment = (data) => {
    let user = data.data;
    const history = useNavigate();
    const { local } = useContext(UserProvider);
    function calculateDiff() {
        const start = moment(user.date);
        const end = moment(new Date().getTime());
        const diff = end.diff(start);

        //express as a duration
        const diffDuration = moment.duration(diff);

        // display
        const days = diffDuration.days();
        const hours = diffDuration.hours();
        const minutes = diffDuration.minutes();

        if (days < 1 && hours > 1) {
            return `${hours}hr, ${minutes}m ago`;
        } else if (days < 1 && hours < 1) {
            return `${minutes} minutes ago`;
        } else if (days >= 1) {
            return `${days} day ago`;
        }
    }
    var borderchoice;
    console.log(local);
    if (local == "white") {
        borderchoice = "1px solid #33373a";
    } else if (local == "black") {
        borderchoice = "1px solid #dee2e6";
    }
    return (
        <div className="tweet" id="tweetsingle" style={{ padding: "10px", border: borderchoice }}>
            <div className="img_place">
                {data ? (
                    <>
                        <img
                            src={user.prof_pic}
                            onClick={() => {
                                history(`/user/${user.author}`);
                            }}
                        />
                        <div className="footer">
                            {user.author}
                            <br />
                            {calculateDiff()}
                        </div>
                    </>
                ) : (
                    "no data"
                )}
            </div>
            <div className="body">
                <div className="text">{user.body}</div>
            </div>
        </div>
    );
};

export default SingleComment;

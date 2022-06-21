import React from "react";

const SingleComment = (data) => {
    let user = data.data;
    return (
        <div className="tweet" id="tweetsingle">
            <div className="img_place">
                {data ? (
                    <>
                        <img
                            src={user.prof_pic}
                            // onClick={() => {
                            //     history(`/user/${element.posted_by}`);
                            // }}
                        />
                        <div className="footer">
                            {user.author}
                            <br />
                            {/* {calculateDiff()} */}
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

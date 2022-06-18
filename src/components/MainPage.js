import React, { useContext } from "react";
import { Container, Navbar, Nav, FloatingLabel, Form, Button } from "react-bootstrap";
import { UserProvider } from "../App";
import GenerateNav from "./GenerateNav";
import { writePostData } from "../firebase";

const MainPage = () => {
    const { userData } = useContext(UserProvider);
    const formSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        console.log(e.target.value);
        console.log("sent");
        writePostData("post", userData.full_name, "test");
    };

    return (
        <>
            <GenerateNav />
            <div className="form">
                <form onSubmit={formSubmit}>
                    <FloatingLabel controlId="floatingTextarea2" label="Start typing...">
                        <Form.Control
                            as="input"
                            placeholder="Leave a comment here"
                            style={{ height: "100px" }}
                        />
                    </FloatingLabel>
                    <Button>Publish</Button>
                </form>
            </div>
        </>
    );
};

export default MainPage;

import React, { useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { UserProvider } from "../App";

const GenerateNav = () => {
    const { userData, currentUser } = useContext(UserProvider);
    return (
        <Navbar
            fixed="top"
            bg="primary"
            variant="dark"
            style={{ height: "50px", display: "flex", justifyContent: "center" }}
        >
            <Container>
                <Navbar.Brand href="/home">Skitter</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/home">Home</Nav.Link>
                    <Nav.Link href="/profile">Your Profile</Nav.Link>
                </Nav>
            </Container>
            {currentUser && userData ? (
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text style={{ margin: "10px" }}>
                        Signed in as: <a href="/profile">{userData.full_name}</a>
                    </Navbar.Text>
                </Navbar.Collapse>
            ) : (
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text style={{ margin: "10px" }}>
                        You are not logged in:{" "}
                        <a href="/login" style={{ color: "red" }}>
                            Log In
                        </a>
                    </Navbar.Text>
                </Navbar.Collapse>
            )}
        </Navbar>
    );
};

export default GenerateNav;

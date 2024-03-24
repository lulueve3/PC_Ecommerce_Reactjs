// NavigationBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const NavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Exchange</Navbar.Brand>
            <Navbar.Collapse className="justify-content-center">
                <Nav>
                    <Nav.Link as={Link} to="/exchange/tasks">Tasks</Nav.Link>
                    <Nav.Link as={Link} to="/exchange/redeem">Redeem</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <Navbar.Text className="ml-auto bg-white p-2 text-success">
                User Points: 100
            </Navbar.Text>
        </Navbar>
    );
};

export default NavigationBar;

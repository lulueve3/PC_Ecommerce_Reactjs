// Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
    return (
        <div className="bg-dark sidebar">
            <Nav className="flex-column p-3">
                <Nav.Item>
                    <Nav.Link href="/admin/dashboard">Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/admin/users">Users</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/admin/orders">Orders</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/admin/products">Products</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default Sidebar;

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';


const DashboardScreen = () => {
    const [statistics, setStatistics] = useState({
        userCount: 0,
        orderCount: 0,
        productCount: 0,
        revenue: 0,
    });

    useEffect(() => {
        getProductCount();
        getOrderCount();
        getUserCount();
    }, []);


    const getProductCount = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            const response = await axios.get('http://localhost:8080/api/admin/analysis/product', config);
            setStatistics(prevStatistics => ({ ...prevStatistics, productCount: response.data.total }));

        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }

    const getUserCount = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            const response = await axios.get('http://localhost:8080/api/admin/analysis/customer', config);
            setStatistics(prevStatistics => ({ ...prevStatistics, userCount: response.data.total }));

        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }

    const getOrderCount = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            const response = await axios.get('http://localhost:8080/api/admin/analysis/order', config);
            setStatistics(prevStatistics => ({ ...prevStatistics, orderCount: response.data.total, revenue: response.data.totalValue }));
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }

    return (
        <Container className="mt-4">
            <h1>Admin Dashboard</h1>
            <Row>
                <Col md={3}>
                    <Link to="/admin/userList">
                        <Card bg="primary" text="white">
                            <Card.Body>
                                <Card.Title>User Count</Card.Title>
                                <Card.Text>{statistics.userCount}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={3}>
                    <Link to="/admin/orderList">
                        <Card bg="warning" text="white">
                            <Card.Body>
                                <Card.Title>Order Count</Card.Title>
                                <Card.Text>{statistics.orderCount}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={3}>
                    <Link to="/admin/productList">
                        <Card bg="primary" text="white">
                            <Card.Body>
                                <Card.Title>Product Count</Card.Title>
                                <Card.Text>{statistics.productCount}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={3}>
                    <Link to="/admin/orderList">
                        <Card bg="success" text="white">
                            <Card.Body>
                                <Card.Title>Revenue</Card.Title>
                                <Card.Text>{statistics.revenue}$</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardScreen;

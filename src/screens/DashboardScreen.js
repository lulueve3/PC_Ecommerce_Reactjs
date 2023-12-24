import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const DashboardScreen = () => {
    const [statistics, setStatistics] = useState({
        userCount: 0,
        orderCount: 0,
        productCount: 0,
    });

    useEffect(() => {
        // Fetch statistics data from your API
        const fetchData = async () => {
            try {
                const response = await axios.get('http://your-api-endpoint/admin/statistics');
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container className="mt-4">
            <h1>Admin Dashboard</h1>
            <Row>
                <Col md={3}>
                    <Card bg="primary" text="white">
                        <Card.Body>
                            <Card.Title>User Count</Card.Title>
                            <Card.Text>{statistics.userCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card bg="warning" text="white">
                        <Card.Body>
                            <Card.Title>Order Count</Card.Title>
                            <Card.Text>{statistics.orderCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card bg="primary" text="white">
                        <Card.Body>
                            <Card.Title>Product Count</Card.Title>
                            <Card.Text>{statistics.productCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card bg="success" text="white">
                        <Card.Body>
                            <Card.Title>revenue</Card.Title>
                            <Card.Text>{statistics.productCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardScreen;

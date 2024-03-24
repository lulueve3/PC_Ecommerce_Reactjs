// RedeemPage.js
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';

const RedeemPage = () => {
    return (
        <>
            <NavigationBar />
            <Container>
                <h2>Redeem</h2>
                <Card>
                    <Card.Body>
                        <Card.Title>Redeem Option 1</Card.Title>
                        <Card.Text>
                            Description of Redeem Option 1
                        </Card.Text>
                        <Button variant="primary">Redeem</Button>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Card.Title>Redeem Option 2</Card.Title>
                        <Card.Text>
                            Description of Redeem Option 2
                        </Card.Text>
                        <Button variant="primary">Redeem</Button>
                    </Card.Body>
                </Card>
                {/* Add more redeem option cards as needed */}
            </Container>
        </>
    );
};

export default RedeemPage;

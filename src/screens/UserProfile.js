// UserProfile.js
import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import ChangePasswordForm from '../components/ChangePasswordForm';

const UserProfile = () => {
    const [user, setUser] = useState({
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Save edited profile information here
        setIsEditing(false);
    };

    const handlePasswordChange = (newPassword) => {
        // Handle password change logic
        console.log('New password:', newPassword);
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <Card.Title>User Profile</Card.Title>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    {isEditing ? (
                                        <Form.Control
                                            type="text"
                                            value={user.username}
                                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                                        />
                                    ) : (
                                        <Form.Control type="text" value={user.username} readOnly />
                                    )}
                                </Form.Group>

                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    {isEditing ? (
                                        <Form.Control
                                            type="email"
                                            value={user.email}
                                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        />
                                    ) : (
                                        <Form.Control type="email" value={user.email} readOnly />
                                    )}
                                </Form.Group>

                                <Form.Group controlId="phone">
                                    <Form.Label>Phone</Form.Label>
                                    {isEditing ? (
                                        <Form.Control
                                            type="text"
                                            value={user.phone}
                                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                        />
                                    ) : (
                                        <Form.Control type="text" value={user.phone} readOnly />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                {isEditing ? (
                                    <Button variant="primary" onClick={handleSaveClick}>
                                        Save Changes
                                    </Button>
                                ) : (
                                    <Button variant="info" onClick={handleEditClick}>
                                        Edit Profile
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form>

                    <Row className="mt-3">
                        <Col md={6}>
                            <ChangePasswordForm onChangePassword={handlePasswordChange} />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;

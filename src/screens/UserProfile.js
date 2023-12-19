import React, { useState } from 'react';
import { Container, Card, Form, Row, Col, Accordion, Button } from 'react-bootstrap';
import ChangePasswordForm from '../components/ChangePasswordForm';
import EditAddress from '../components/EditAddress';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UserProfile = () => {
    const [user, setUser] = useState({
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        addresses: [
            { name: 'Name 1', phone: 'Phone 1', city: 'City 1', district: 'District 1', ward: 'Ward 1', street: 'Street 1' },
            { name: 'Name 2', phone: 'Phone 2', city: 'City 2', district: 'District 2', ward: 'Ward 2', street: 'Street 2' },
            { name: 'Name 3', phone: 'Phone 3', city: 'City 3', district: 'District 3', ward: 'Ward 3', street: 'Street 3' },
            { name: 'Name 4', phone: 'Phone 4', city: 'City 4', district: 'District 4', ward: 'Ward 4', street: 'Street 4' },
        ],
    });


    return (
        <>
            <ToastContainer />
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header style={{ fontSize: '24px', width: '100%' }}>
                        User Profile
                    </Accordion.Header>
                    <Accordion.Body>
                        <Container className="mt-4">
                            <Card>
                                <Card.Body>
                                    <Form>
                                        <Row>
                                            <Col md={6}>
                                                <>edit</>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header style={{ fontSize: '24px', width: '100%' }}>
                        Change Password
                    </Accordion.Header>
                    <Accordion.Body>
                        <Container className="mt-4">
                            <Card>
                                <Card.Body>
                                    <Row className="mt-3">
                                        <Col md={6}>
                                            <ChangePasswordForm />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header style={{ fontSize: '24px', width: '100%' }}>
                        User Address
                    </Accordion.Header>
                    <Accordion.Body>
                        <Container className="mt-4">
                            <Card>
                                <Card.Body>
                                    <EditAddress />
                                </Card.Body>
                            </Card>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>



    );
};

export default UserProfile;

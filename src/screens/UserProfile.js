import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Accordion, Button, Mod } from 'react-bootstrap';
import ChangePasswordForm from '../components/ChangePasswordForm';
import EditAddress from '../components/EditAddress';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UserProfile = () => {
    const [user, setUser] = useState({
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        phone: '123-456-7890'
    });

    const [addresses, setAddresses] = useState([])

    const [showEditModal, setShowEditModal] = useState(false);
    const [editedAddressIndex, setEditedAddressIndex] = useState(null);


    const handleEditAddress = (index) => {
        setEditedAddressIndex(index);
        setShowEditModal(true);
    };

    const handleSaveEditedAddress = (editedAddress) => {
        // Update the user's addresses array with the edited address
        const updatedAddresses = [...user.addresses];
        updatedAddresses[editedAddressIndex] = editedAddress;
        setUser({ ...user, addresses: updatedAddresses });

        // Close the modal
        setShowEditModal(false);
    };

    const handleCancelEdit = () => {
        // Close the modal without saving changes
        setShowEditModal(false);
    };

    const handleRemoveAddress = (index) => {
        const updatedAddresses = [...user.addresses];
        updatedAddresses.splice(index, 1);
        setUser({ ...user, addresses: updatedAddresses });
    };

    const handleAddAddress = () => {
        setShowEditModal(true);
    };


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
                                    <Container className="mt-4">
                                        <Card>
                                            <Card.Body>
                                                <Form>
                                                    {addresses.map((address, index) => (
                                                        <Row key={index} className="mb-3">
                                                            <Col md={6}>
                                                                <p>
                                                                    <strong>Name:</strong> {address.name}<br />
                                                                    <strong>Phone:</strong> {address.phone}<br />
                                                                    <strong>Street:</strong> {address.street + "-" + address.ward + "-" + address.district + "-" + address.city}
                                                                </p>
                                                            </Col>
                                                            <Col md={3}>
                                                                <Button variant="primary" onClick={() => handleEditAddress(index)}>
                                                                    Edit
                                                                </Button>
                                                            </Col>
                                                            <Col md={3}>
                                                                <Button variant="danger" onClick={() => handleRemoveAddress(index)}>
                                                                    Remove
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Form>
                                                <Button variant="success" onClick={handleAddAddress}>
                                                    Add Address
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {showEditModal && (
                <EditAddress
                    address={addresses[editedAddressIndex]}
                    onSave={handleSaveEditedAddress}
                    onCancel={handleCancelEdit}
                />
            )}
        </>



    );
};

export default UserProfile;

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Accordion, Button, Mod } from 'react-bootstrap';
import ChangePasswordForm from '../components/ChangePasswordForm';
import EditAddress from '../components/EditAddress';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams, useNavigate } from 'react-router-dom'



const UserProfile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    const [addresses, setAddresses] = useState([{ lastName: "hải", phone: "123", address: "việt nam" }])

    const [showEditModal, setShowEditModal] = useState(false);
    const [editedAddressIndex, setEditedAddressIndex] = useState(null);


    const handleEditAddress = (index) => {
        setEditedAddressIndex(index);
        setShowEditModal(true);
    };

    const handleSaveEditedAddress = (editedAddress) => {
        // Update the user's addresses array with the edited address
        const updatedAddresses = [...addresses];
        updatedAddresses[editedAddressIndex] = editedAddress;
        setAddresses(updatedAddresses);

        // Close the modal
        setShowEditModal(false);
    };

    const handleCancelEdit = () => {
        // Close the modal without saving changes
        setShowEditModal(false);
    };

    const handleRemoveAddress = (index) => {
        const updatedAddresses = [addresses];
        updatedAddresses.splice(index, 1);
        setUser({ ...user, addresses: updatedAddresses });
    };

    const handleAddAddress = () => {
        setShowEditModal(true);
    };

    const getUserProfile = async () => {
        try {


            const accessToken = localStorage.getItem('accessToken') || null;

            console.log(accessToken);


            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };


            const { data } = await axios.get('http://localhost:8080/api/customer', config)
            setUser(data)

        } catch (error) {

        }
    }
    useEffect(() => {
        getUserProfile();
    }, [])

    const handleSaveProfile = () => {
        console.log(user);
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
                                                <Form.Group controlId="formFirstName">
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={user.firstName || ""}
                                                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="formLastName">
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={user.lastName || ""}
                                                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group controlId="formEmail">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={user.email}
                                                        readOnly
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button variant="primary" className="mt-3" onClick={handleSaveProfile}>
                                            Save
                                        </Button>
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

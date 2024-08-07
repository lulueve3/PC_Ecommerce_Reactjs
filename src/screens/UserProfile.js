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

    const [addresses, setAddresses] = useState([])

    const [showEditModal, setShowEditModal] = useState(false);
    const [editedAddressIndex, setEditedAddressIndex] = useState(null);
    const [editedAddress, setEditedAddress] = useState({});


    useEffect(() => {
        fetchAddresses();
        getUserProfile();
    }, []);

    const fetchAddresses = async () => {
        const accessToken = localStorage.getItem('accessToken') || null;
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        try {
            const { data } = await axios.get('http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer/addresses', config);
            setAddresses(data.addresses);
        } catch (error) {
            toast.error('Failed to fetch addresses');
        }
    };

    const handleSaveEditedAddress = async (editedAddress) => {
        const accessToken = localStorage.getItem('accessToken') || null;
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        try {
            if (editedAddressIndex !== null) {
                // Editing an existing address
                await axios.patch(`http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer/addresses/${editedAddress.id}`, editedAddress, config);
                toast.success('Address updated successfully');
            } else {
                // Adding a new address
                await axios.post('http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer/addresses', editedAddress, config);
                toast.success('Address added successfully');
            }
            fetchAddresses(); // Refresh the list
            setShowEditModal(false);
        } catch (error) {
            toast.error('Failed to save address');
        }
    };

    const handleRemoveAddress = async (id) => {
        const accessToken = localStorage.getItem('accessToken') || null;
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        try {
            await axios.delete(`http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer/addresses/${id}`, config);
            toast.success('Address removed successfully');
            fetchAddresses(); // Refresh the list
        } catch (error) {
            toast.error('Failed to remove address');
        }
    };



    const handleEditAddress = (index) => {
        const selectedAddress = addresses[index];
        setEditedAddressIndex(index); // Lưu vị trí của địa chỉ đang được chỉnh sửa
        setShowEditModal(true); // Hiển thị modal

        // Cập nhật trạng thái để chứa thông tin địa chỉ được chọn
        // Điều này sẽ truyền thông tin địa chỉ tới EditAddress component
        setEditedAddress({ ...selectedAddress });
    };

    const handleAddNewAddress = () => {
        setEditedAddressIndex(null); // No index since it's a new address
        setShowEditModal(true);
    };
    // const handleSaveEditedAddress = (editedAddress) => {
    //     // Update the user's addresses array with the edited address
    //     const updatedAddresses = [...addresses];
    //     updatedAddresses[editedAddressIndex] = editedAddress;
    //     setAddresses(updatedAddresses);

    //     // Close the modal
    //     setShowEditModal(false);
    // };

    const handleCancelEdit = () => {
        // Close the modal without saving changes
        setShowEditModal(false);
    };

    // const handleRemoveAddress = (index) => {
    //     const updatedAddresses = [addresses];
    //     updatedAddresses.splice(index, 1);
    //     setUser({ ...user, addresses: updatedAddresses });
    // };

    const handleAddAddress = () => {
        setShowEditModal(true);
    };

    const getUserProfile = async () => {
        try {


            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };


            const { data } = await axios.get('http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer', config)
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

    const addressStyle = {
        fontFamily: 'Arial, sans-serif', // This is a widely available, readable font
        fontSize: '16px' // This size is generally readable for most users
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
                                        {/* <Button variant="primary" className="mt-3" onClick={handleSaveProfile}>
                                            Save
                                        </Button> */}
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
                        Address
                    </Accordion.Header>
                    <Accordion.Body>
                        <Container className="mt-4">
                            <Card>
                                <Card.Body>
                                    <Button variant="primary" className="mb-3" onClick={handleAddNewAddress}>
                                        Add New Address
                                    </Button>
                                    <div>
                                        {Array.isArray(addresses) && addresses
                                            .sort((a, b) => b.id - a.id)
                                            .map((address, index) => (
                                                <React.Fragment key={address.id}> {/* Use address.id instead of index for the key */}
                                                    <div className="mb-2 d-flex justify-content-between">
                                                        <div>
                                                            <p style={addressStyle}>{address.name} - {address.phone}</p>
                                                            <p style={addressStyle}>{address.street}</p>
                                                            <p style={addressStyle}>{address.address}</p>
                                                            <p style={addressStyle}>{address.ward} - {address.district} - {address.city}</p>
                                                        </div>
                                                        <div>
                                                            <Button variant="secondary" onClick={() => handleEditAddress(index)}>
                                                                Edit
                                                            </Button>{' '}
                                                            <Button variant="danger" onClick={() => handleRemoveAddress(address.id)}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </React.Fragment>
                                            ))
                                        }

                                    </div>
                                </Card.Body>
                            </Card>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>


            </Accordion>

            {showEditModal && (
                <EditAddress
                    address={editedAddressIndex !== null ? addresses[editedAddressIndex] : {}}
                    onSave={handleSaveEditedAddress}
                    onCancel={handleCancelEdit}
                />
            )}
        </>



    );
};

export default UserProfile;

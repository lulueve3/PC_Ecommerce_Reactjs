import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editedCollection, setEditedCollection] = useState({ title: '' });

    useEffect(() => {
        // Fetch collections when the component mounts
        getCollections();
    }, []);

    const getCollections = async () => {
        try {

            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            const response = await axios.get('http://localhost:8080/api/admin/collections', config);
            setCollections(response.data.results);
            console.log(response.data.results);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveCollection = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            if (editedCollection.id) {
                // If _id exists, it means we are editing an existing collection
                await axios.patch(`http://localhost:8080/api/admin/collections/${editedCollection.id}`, {
                    title: editedCollection.title,
                    active: true,
                    description: "string"
                }, config);
            } else {
                // If _id doesn't exist, it means we are adding a new collection
                await axios.post('http://localhost:8080/api/admin/collections', editedCollection, config);
            }

            // Refresh the collections list
            getCollections();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving collection:', error);
        }
    };

    const handleEditCollection = (collection) => {
        setEditedCollection({ ...collection });
        handleShowModal();
    };

    const handleDeleteCollection = async (id) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            await axios.delete(`http://localhost:8080/api/admin/collections/${id}`, config);
            getCollections();
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <h2>Collections</h2>
                    <Button variant="primary" onClick={handleShowModal}>
                        Add Collection
                    </Button>
                    <Table className="mt-3" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collections?.map((collection) => (
                                <tr key={collection.id}>
                                    <td>{collection.title}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleEditCollection(collection)}>
                                            Edit
                                        </Button>{' '}
                                        <Button variant="danger" onClick={() => handleDeleteCollection(collection._id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editedCollection._id ? 'Edit Collection' : 'Add Collection'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCollectionName">
                            <Form.Label>Collection Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter collection name"
                                value={editedCollection.title}
                                onChange={(e) => setEditedCollection({ ...editedCollection, title: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveCollection}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CollectionsPage;

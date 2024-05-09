import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const BuildDetailsModal = ({ show, onHide, buildCode }) => {
    const [loadingBuild, setLoadingBuild] = useState(false);
    const [buildDetails, setBuildDetails] = useState(null);

    const fetchPcBuild = async () => {
        if (!buildCode) {
            toast.error('Build code is required.');
            return;
        }

        setLoadingBuild(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/pc-builds/code/${buildCode}`);
            setBuildDetails(response.data); // Assume response.data contains the build details
            console.log(response);
        } catch (error) {
            console.error('Error fetching PC build:', error);
            toast.error('Failed to fetch PC build. Please try again.');
        } finally {
            setLoadingBuild(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchPcBuild();

        }
    }, [show, buildCode]);

    useEffect(() => {
        console.log(buildDetails);
    }, [buildDetails])

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Build Details - {buildDetails?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loadingBuild ? (
                    <p>Loading...</p>
                ) : buildDetails ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Component Type</th>
                                <th>Component Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buildDetails.items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.partType}</td>
                                    <td>{item.part.title}{item.part.variantTitle ? ` - ${item.part.variantTitle}` : ''}</td>
                                    <td>${item.part.price.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Price</td>
                                <td style={{ fontWeight: 'bold' }}>
                                    ${buildDetails.items.reduce((acc, item) => acc + item.part.price, 0).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                ) : (
                    <p>No build details available.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BuildDetailsModal;
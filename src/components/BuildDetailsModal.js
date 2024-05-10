import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addToCart } from '../action/cartAction';

const BuildDetailsModal = ({ show, onHide, buildCode }) => {
    const [loadingBuild, setLoadingBuild] = useState(false);
    const [buildDetails, setBuildDetails] = useState(null);

    const dispatch = useDispatch();
    const handleAddAllToCart = () => {
        if (buildDetails && buildDetails.items) {
            buildDetails.items.forEach((item) => {
                dispatch(addToCart({
                    productId: item.part.productId,
                    id: item.id, // Assuming this is the variant ID
                    variant: item.part.variantTitle, // Assuming this is the variant title
                    title: item.part.title,
                    qty: 1, // Quantity is set to 1, change as needed
                    price: item.part.price,
                    image: item.part.image?.src || '/imgNotFound.png', // Fallback to a default image if none provided
                    inStock: item.part.quantity // Assuming this is the stock quantity
                }));
            });
            toast.success('All items added to cart successfully!');
        }
    };

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
            onHide(); // Close the modal if there's an error
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
                                    <td>
                                        <Link to={`/product/${item.part.productId}`}>
                                            {item.part.image ? (
                                                <img src={item.part.image.src} alt={item.part.title} style={{ width: '50px', height: '50px' }} />
                                            ) : (
                                                <span></span> // Placeholder text or element when there's no image
                                            )}
                                            {item.part.title}
                                            {item.part.variantTitle !== 'Default Title' && item.part.variantTitle ? ` - ${item.part.variantTitle}` : ''}
                                        </Link>
                                    </td>
                                    <td>${item.part.price.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Price</td>
                                <td style={{ fontWeight: 'bold' }}>
                                    ${buildDetails.items.reduce((acc, item) => acc + item.part.price, 0).toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    <Button
                                        variant="success"
                                        onClick={handleAddAllToCart}
                                        // Disable if there are no items or if all items are out of stock
                                        disabled={!buildDetails || buildDetails.items.every(item => item.part.quantity <= 0)}
                                    >
                                        Add All to Cart
                                    </Button>
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
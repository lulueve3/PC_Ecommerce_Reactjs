import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';

const AppScreen = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const apps = [
        { id: 1, name: "Minecraft" },
        { id: 2, name: "LOL" },
        { id: 3, name: "Fortnite" },
        { id: 4, name: "Apex_Legends" },
        { id: 5, name: "GTAV" },
        { id: 6, name: "PUBG" },
        { id: 7, name: "CapCut" },
        { id: 8, name: "Photoshop" },
        { id: 9, name: "Adobe_Premiere_Pro" },
    ]

    const handleImageClick = (imageId) => {
        if (selectedImages.includes(imageId)) {
            setSelectedImages(selectedImages.filter(id => id !== imageId));
        } else {
            setSelectedImages([...selectedImages, imageId]);
        }
    };

    const handleDoneClick = () => {
        setShowModal(false);
    };

    const handleShowModalClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Container>
            <Button variant="primary" onClick={handleShowModalClick}>
                Choose Your Apps
            </Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Product Images</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {apps.map(game => (
                            <Col key={game.id} xs={6} md={4} lg={4} className="mb-4">
                                <img
                                    src={`/images/${game.name}.jpg`}
                                    alt={game.name}
                                    className={`img-thumbnail ${selectedImages.includes(game.id) ? "selected" : ""}`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} // Fill container while maintaining aspect ratio
                                    onClick={() => handleImageClick(game.id)}
                                />
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={handleDoneClick}>
                        Done
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {selectedImages.length > 0 && (
                <div>
                    <h1>suggested products</h1>
                    <Row>
                        {selectedImages.map(imageId => {
                            const game = apps.find(app => app.id === imageId);
                            return (
                                <Col key={imageId} xs={6} md={4} lg={3} className="mb-4">
                                    <img
                                        src={`/images/${game.name}.jpg`}
                                        alt={game.name}
                                        className="img-thumbnail"
                                    />
                                </Col>
                            );
                        })}
                    </Row>



                    <Button variant="primary" onClick={handleShowModalClick}>
                        Show Modal
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default AppScreen;

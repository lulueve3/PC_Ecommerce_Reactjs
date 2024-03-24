import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import SearchBar from '../components/SearchBar';
import CreatePostForm from '../components/CreatePostForm';
import { Link } from 'react-router-dom';


const QnAPScreen = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [samplePosts, setSamplePosts] = useState([
        { id: 1, title: 'Sample Post 1', content: 'Content of Sample Post 1' },
        { id: 2, title: 'Sample Post 2', content: 'Content of Sample Post 2' },
        { id: 3, title: 'Sample Post 3', content: 'Content of Sample Post 3' }
    ]);


    const handleCreatePost = (newPost) => {
        // Logic tạo bài đăng mới
    };

    return (
        <Container style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1 className="text-center mb-4">Q&A Page</h1>
            <Row className="mb-4">
                <Col>
                    <div className='d-flex justify-content-end'>
                        <Button onClick={() => setShowCreateForm(true)}>Create Post</Button>
                    </div>
                    <SearchBar handleSearch={() => { }} fullWidth={true} />
                </Col>
            </Row>
            <Modal show={showCreateForm} onHide={() => setShowCreateForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreatePostForm handleCreatePost={handleCreatePost} />
                </Modal.Body>
            </Modal>
            <Row>
                {samplePosts?.map(post => (
                    <Col key={post.id} md={6} className="mb-4">
                        <Link to={`/PostDetail`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text>{post.content}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default QnAPScreen;
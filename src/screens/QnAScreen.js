import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Card, Pagination } from 'react-bootstrap';
import SearchBar from '../components/SearchBar';
import CreatePostForm from '../components/CreatePostForm';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





const QnAPScreen = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');


    const fetchPosts = async (page = 0, keyword = '') => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;
            const response = await axios.get(`http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/forums/questions`, {
                params: {
                    page: page,
                    size: 10,
                    sortBy: 'id',
                    sortDirection: 'DESC',
                    keyword: keyword // Add the search keyword to the request parameters
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            setPosts(response.data.results);
            setTotalPages(response.data.page.totalPages); // Update the total pages
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage - 1, searchKeyword);
    }, [currentPage, searchKeyword]);

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        setCurrentPage(1); // Reset to the first page
        fetchPosts(0, keyword);
    };



    const handleCreatePost = async (newPost) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;

            const response = await axios.post('http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/forums/questions', newPost, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Replace YOUR_TOKEN_HERE with the actual token
                }
            });
            console.log('Post created:', response.data);
            toast.success('Post created successfully!');
            setShowCreateForm(false);
            // Optionally, fetch posts again to show the new post
            fetchPosts();
        } catch (error) {
            console.error('Failed to create post:', error);
            toast.error('Failed to fetch posts. Please try again later.');

        }
    };

    return (
        <Container style={{
            backgroundColor: '#0196c0', minHeight: '100vh',
            borderRadius: '20px'

        }}>
            <h1 className="text-center mb-4">Q&A</h1>
            <Row className="mb-4">
                <Col>
                    <div className='d-flex justify-content-end'>
                        <Button style={{
                            marginBottom: '4px',
                            backgroundColor: 'rgb(191, 219, 247)',
                            color: 'black'
                        }} className='mb-4' onClick={() => setShowCreateForm(true)}>Create Post</Button>
                    </div>
                    <SearchBar handleSearch={handleSearch} fullWidth={true} />
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
                {posts?.map(post => (
                    <Col key={post.id} md={6} className="mb-4">
                        <Link to={`/PostDetail/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Card style={{
                                backgroundColor: 'white',
                                height: '12rem',
                                borderRadius: '20px',
                                boxShadow: '0 4px 6px 0 hsla(0, 0%, 0%, 0.1)'
                            }}>
                                <Card.Body>
                                    <Card.Title style={{ fontWeight: 'bold' }}>{post.title}</Card.Title>
                                    <Card.Text>{post.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
            <Pagination className="justify-content-center">
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages).keys()].map(n => (
                    <Pagination.Item key={n + 1} active={n + 1 === currentPage} onClick={() => setCurrentPage(n + 1)}>
                        {n + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        </Container >
    );
};

export default QnAPScreen;

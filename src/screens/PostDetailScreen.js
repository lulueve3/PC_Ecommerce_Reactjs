import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';

const PostDetail = ({ handleBack }) => {
    // Bài đăng mẫu
    const post = {
        id: 1,
        title: 'Sample Post',
        content: 'Content of the sample post...'
    };

    // Danh sách comment mẫu
    const [comments, setComments] = useState([
        { id: 1, user: 'User1', content: 'Comment 1', likes: 0, dislikes: 0 },
        { id: 2, user: 'User2', content: 'Comment 2', likes: 0, dislikes: 0 },
        { id: 3, user: 'User3', content: 'Comment 3', likes: 0, dislikes: 0 }
    ]);

    // Trạng thái của form nhập comment mới
    const [newComment, setNewComment] = useState('');

    const handleLike = (commentId) => {
        setComments(prevComments => prevComments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, likes: comment.likes + 1 };
            }
            return comment;
        }));
    };

    const handleDislike = (commentId) => {
        setComments(prevComments => prevComments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, dislikes: comment.dislikes + 1 };
            }
            return comment;
        }));
    };

    const handleSubmitComment = () => {
        // Thêm comment mới vào danh sách
        const newId = comments.length + 1;
        const newCommentObj = { id: newId, user: 'User', content: newComment, likes: 0, dislikes: 0 };
        setComments(prevComments => [...prevComments, newCommentObj]);
        // Xóa nội dung comment sau khi gửi
        setNewComment('');
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <div style={{ backgroundColor: '#84a1e3', padding: '20px', borderRadius: '10px' }}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </div>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Form>
                        <Form.Group controlId="newComment">
                            <Form.Label>Add a Comment:</Form.Label>
                            <Form.Control as="textarea" rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSubmitComment}>Submit</Button>
                    </Form>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <h3>Comments:</h3>
                    {comments.map(comment => (
                        <Card key={comment.id} className="mb-2">
                            <Card.Body>
                                <Card.Title>{comment.user}</Card.Title>
                                <Card.Text>{comment.content}</Card.Text>
                                <div>
                                    <Button variant="success" className="mr-2" onClick={() => handleLike(comment.id)}>Like ({comment.likes})</Button>
                                    <Button variant="danger" onClick={() => handleDislike(comment.id)}>Dislike ({comment.dislikes})</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Button onClick={handleBack}>Back to Posts</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default PostDetail;

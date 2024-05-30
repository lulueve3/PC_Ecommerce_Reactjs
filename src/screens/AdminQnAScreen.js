import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Pagination } from 'react-bootstrap';
const AdminQnAScreen = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;
            const response = await axios.get('http://localhost:8080/api/admin/forums/questions', {
                params: {
                    page: page, // Make sure 'page' variable is defined or passed as an argument
                    size: 10,
                    sortBy: 'id',
                    sortDirection: 'DESC'
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setQuestions(response.data.results);
            setTotalPages(response.data.page.totalPages); // Assuming API returns total pages
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [page]);


    const handlePageChange = (pageNumber) => {
        setPage(pageNumber - 1);
        fetchQuestions();
    };

    const handleApproveQuestion = async (id, approved) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;

            const response = await axios.patch(`http://localhost:8080/api/admin/forums/questions/${id}`,
                { active: approved }, // Assuming the QuestionDto contains an 'approved' field
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}` // Replace with your stored admin token
                    }
                }
            );
            console.log('Question updated:', response.data);
            fetchQuestions(); // Refresh the list after updating
        } catch (error) {
            console.error(`Failed to update question with id ${id}:`, error);
        }
    };

    return (
        <Container>
            <Modal show={selectedQuestion !== null} onHide={() => setSelectedQuestion(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Question Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedQuestion && (
                        <>
                            <h5>{selectedQuestion.title}</h5>
                            <p>{selectedQuestion.description}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedQuestion(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <h1>Admin Dashboard</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions?.map((question) => (
                        <tr key={question.id} style={{ backgroundColor: question.active ? '#BAD4AA' : '' }}>
                            <td>{question.id}</td>
                            <td>{question.title}</td>
                            <td>
                                {question.active === true ? null : (
                                    <Button
                                        variant="success"
                                        onClick={() => handleApproveQuestion(question.id, true)}
                                    >
                                        Approve
                                    </Button>
                                )}
                                {question.active === false ? null : (
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleApproveQuestion(question.id, false)}
                                    >
                                        Reject
                                    </Button>
                                )}

                                <Button
                                    variant="info"
                                    onClick={() => setSelectedQuestion(question)}
                                >
                                    Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Container>
                {/* ... other components */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Pagination>
                        {[...Array(totalPages).keys()].map((num) => (
                            <Pagination.Item
                                key={num}
                                active={num === page}
                                onClick={() => handlePageChange(num + 1)}
                            >
                                {num + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </Container>
        </Container>
    );
};

export default AdminQnAScreen;
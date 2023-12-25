import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';

const UserListScreen = () => {
    const [userList, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Fetch collections when the component mounts
        getUser();
    }, []);

    const getUser = async (page = 0, size = 10) => {
        try {

            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            const response = await axios.get('http://localhost:8080/api/admin/customers?page=0&size=10&sortBy=id&sortDirection=ASC', config);
            setUserList(response.data.results);
            console.log(response.data.results);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        getUser(pageNumber - 1);
    };


    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <h2>User List</h2>

                    <Table className="mt-3" striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>

                            </tr>
                        </thead>
                        <tbody>
                            {userList?.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.firstName + "     " + user.lastName}</td>
                                    <td>{user.email} </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <div className='d-flex justify-content-center'>
                <Pagination>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                        <Pagination.Item
                            key={pageNumber}
                            active={pageNumber === currentPage}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </Container>
    );
};

export default UserListScreen
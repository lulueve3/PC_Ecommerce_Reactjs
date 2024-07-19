import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Pagination, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserListScreen = () => {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch users when the component mounts
    getUser();
  }, []);

  useEffect(() => {
    // Fetch users when the search term changes
    getUser(currentPage - 1, 10, searchTerm);
  }, [searchTerm]);

  const getUserOrder = (id) => {
    navigate(`./${id}`);
  };

  const getUser = async (page = 0, size = 10, keyword = "") => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/customers?page=${page}&size=${size}&sortBy=id&sortDirection=ASC&keyword=${keyword}`,
        config
      );
      setUserList(response.data.results);
      setTotalPages(response.data.page.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getUser(pageNumber - 1, 10, searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h2>User List</h2>
          <Form.Control
            type="text"
            placeholder="Search by email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-3"
          />
          <Table className="mt-3" striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userList?.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName + " " + (user.lastName || "")}</td>
                  <td>{user.email}</td>
                  <td>{"$" + user.totalOrderValue.toFixed(2)}</td>
                  <td
                    onClick={() => getUserOrder(user.id)}
                    style={{ fontSize: "2em", cursor: "pointer" }}
                  >
                    ℹ️
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <div className="d-flex justify-content-center">
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </div>
    </Container>
  );
};

export default UserListScreen;

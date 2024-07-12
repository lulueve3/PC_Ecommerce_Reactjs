import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Pagination } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserListScreen = () => {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch users when the component mounts
    getUser();
  }, []);

  const getUserOrder = (id) => {
    navigate(`./${id}`);
  };

  const getUser = async (page = 0, size = 10) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/customers?page=${page}&size=${size}&sortBy=id&sortDirection=ASC`,
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
    getUser(pageNumber - 1);
  };

  const filteredUserList = userList.filter((user) => user.email); // Filter out users with null or empty email

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
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserList.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName + " " + (user.lastName || "")}</td>
                  <td>{user.email}</td>
                  <td>{user.totalOrderValue + " $"}</td>
                  <td
                    onClick={() => getUserOrder(user.id)}
                    style={{ fontSize: "2em" }}
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

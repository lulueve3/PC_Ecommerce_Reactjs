import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Pagination,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedCollection, setEditedCollection] = useState({ title: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    getCollections(currentPage - 1, 10, searchTerm);
  }, [searchTerm]);

  const getCollections = async (page = 0, size = 10, keyword = "") => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/collections?page=${page}&size=${size}&sortBy=id&sortDirection=ASC&keyword=${keyword}`,
        config
      );
      setCollections(response.data.results);
      setTotalPages(response.data.page.totalPages);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getCollections(pageNumber - 1, 10, searchTerm);
  };

  const handleSaveCollection = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      if (editedCollection.id) {
        await axios.patch(
          `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/collections/${editedCollection.id}`,
          {
            title: editedCollection.title,
            active: true,
            description: "string",
          },
          config
        );
      } else {
        await axios.post(
          "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/collections",
          {
            ...editedCollection,
            active: true,
          },
          config
        );
      }
      getCollections();
      handleCloseModal();
    } catch (error) {
      toast.error("Collection name is Existed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleEditCollection = (collection) => {
    setEditedCollection({ ...collection });
    handleShowModal();
  };

  const handleDeleteCollection = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/collections/${id}`,
        config
      );
      getCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container>
      <ToastContainer />

      <Row className="mt-4 ">
        <Col>
          <h2>Collections</h2>
          <Button variant="primary" onClick={handleShowModal}>
            Add Collection
          </Button>
          {/* <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="mt-3"
          /> */}
          <Table className="mt-3" striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {collections?.map((collection) => (
                <tr key={collection.id}>
                  <td>{collection.id}</td>
                  <td>{collection.title}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => handleEditCollection(collection)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteCollection(collection.id)}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>{JSON.stringify(collection.active)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editedCollection.id ? "Edit Collection" : "Add Collection"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCollectionName">
              <Form.Label>Collection Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter collection name"
                value={editedCollection.title}
                onChange={(e) =>
                  setEditedCollection({
                    ...editedCollection,
                    title: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveCollection}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
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

export default CollectionsPage;

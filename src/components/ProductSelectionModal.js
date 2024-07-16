import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Image } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductSelectionModal = ({ show, onHide, onSelect, collectionId }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async (collectionId, searchTerm, page) => {
    try {
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/products`,
        {
          params: {
            page,
            size: 10,
            sortBy: "id",
            sortDirection: "ASC",
            collectionIds: collectionId,
            keyword: searchTerm,
          },
        }
      );
      setProducts(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    }
  };

  useEffect(() => {
    if (show) {
      fetchProducts(collectionId, searchTerm, page);
    }
  }, [show, collectionId, searchTerm, page]);

  const handleSelectProduct = (product) => {
    onSelect(product);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchTerm">
          <Form.Label>Search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.image && (
                    <Image
                      src={product.image.src}
                      alt={product.title}
                      thumbnail
                    />
                  )}
                </td>
                <td>{product.title}</td>
                <td>${product.variants[0].price}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleSelectProduct(product)}
                  >
                    Select
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-between">
          <Button
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </Modal.Body>
      <ToastContainer />
    </Modal>
  );
};

export default ProductSelectionModal;

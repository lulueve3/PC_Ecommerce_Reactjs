import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Pagination } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RedeemPage.css"; // Import custom CSS

const RedeemPage = () => {
  const [points, setPoints] = useState(0);
  const [redeemOptions, setRedeemOptions] = useState([]);
  const [discountCode, setDiscountCode] = useState(null); // State to store discount code
  const [showDiscount, setShowDiscount] = useState(false); // State to control displaying discount code
  const [currentPage, setCurrentPage] = useState(0); // State to track current page
  const [totalPages, setTotalPages] = useState(1); // State to store total pages

  const fetchPoints = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const response = await axios.get(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/rewards/point",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPoints(response.data.point);
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchRedeemOptions = async (page) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/rewards?page=${page}&size=10&sortBy=id&sortDirection=DESC`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Set total pages based on response
      setTotalPages(response.data.page.totalPages);

      // Set redeem options
      setRedeemOptions(response.data.results);
    } catch (error) {
      console.error("Error fetching redeem options:", error);
    }
  };

  useEffect(() => {
    fetchRedeemOptions(currentPage);
  }, [currentPage]);

  const handleRedeem = async (title) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const response = await axios.post(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/rewards",
        {
          code: title,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDiscountCode(response.data.discountCode);
      setShowDiscount(true);
      fetchPoints();
      toast.success("Redeemed successfully!");
    } catch (error) {
      console.error("Error redeeming:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message); // Hiển thị thông báo lỗi từ phản hồi của API
      } else {
        toast.error("An error occurred while redeeming. Please try again."); // Thông báo lỗi chung
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <NavigationBar />
      <Container>
        <ToastContainer />
        <Row className="align-items-center my-3">
          <Col>
            <h2>Redeem</h2>
          </Col>
          <Col className="text-end">
            <div className="points-box">
              <h5 className="points-text">
                User Points: <span>{points}</span>
              </h5>
            </div>
          </Col>
        </Row>

        {showDiscount && discountCode && (
          <Card.Text className="text-success">
            <h6 style={{ color: "blue" }}>
              Your discount code: <strong>{discountCode}</strong>
            </h6>
          </Card.Text>
        )}

        {redeemOptions?.map((option) => (
          <Card key={option.id} className="mb-3">
            <Card.Body>
              <Card.Title>{option.title}</Card.Title>
              <Card.Text>{option.description}</Card.Text>
              <Card.Text>
                <strong>Cost:</strong> {option.cost * -1}
              </Card.Text>
              <Card.Text>
                <strong>Valid Until:</strong>{" "}
                {new Date(option.endAt).toLocaleString()}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleRedeem(option.title)}
                disabled={option.code || showDiscount}
              >
                Redeem
              </Button>
              {option.code && (
                <Card.Text className="text-success mt-2">
                  <h6 style={{ color: "blue" }}>
                    Your discount code: <strong>{option.code}</strong>
                  </h6>
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        ))}

        <Row className="justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            />
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            />
          </Pagination>
        </Row>
      </Container>
    </>
  );
};

export default RedeemPage;

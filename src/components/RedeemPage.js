import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import "./RedeemPage.css"; // Import custom CSS
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RedeemPage = () => {
  const [points, setPoints] = useState(30);
  const [redeemOptions, setRedeemOptions] = useState([]);
  const [discountCode, setDiscountCode] = useState(null); // State to store discount code
  const [showDiscount, setShowDiscount] = useState(false); // State to control displaying discount code

  useEffect(() => {
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

    fetchPoints();
  }, []);

  useEffect(() => {
    const fetchRedeemOptions = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken") || null;

        const response = await axios.get(
          "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/rewards?page=0&size=10&sortBy=id&sortDirection=ASC",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRedeemOptions(response.data.results);
      } catch (error) {
        console.error("Error fetching redeem options:", error);
      }
    };

    fetchRedeemOptions();
  }, []);

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
    } catch (error) {
      console.error("Error redeeming:", error);
      // Handle error, show error message to user
    }
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

        {redeemOptions.map((option) => (
          <Card key={option.id} className="mb-3">
            <Card.Body>
              <Card.Title>{option.title}</Card.Title>
              <Card.Text>{option.description}</Card.Text>
              <Button
                variant="primary"
                onClick={() => handleRedeem(option.title)}
              >
                Redeem
              </Button>
            </Card.Body>
          </Card>
        ))}

        {/* Display the discount code if available */}
        {/* {showDiscount && discountCode && (
          <Card className="mt-3">
            <Card.Body>
              <Card.Text className="text-success">
                Your discount code: <strong>{discountCode}</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        )} */}
      </Container>
    </>
  );
};

export default RedeemPage;

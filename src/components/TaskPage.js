import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import "./RedeemPage.css"; // Import custom CSS

const TaskPage = () => {
  const [points, setPoints] = useState(0);

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
        setPoints(Number(response.data.point));
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchPoints();
  }, []);

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="align-items-center my-3">
          <Col>
            <h2>Tasks</h2>
          </Col>
          <Col className="text-end">
            <div className="points-box">
              <h5 className="points-text">
                User Points: <span>{points}</span>
              </h5>
            </div>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <Card.Title>Task 1</Card.Title>
            <Card.Text>Description of Task 1</Card.Text>
            <Button variant="primary">Complete Task</Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Task 2</Card.Title>
            <Card.Text>Description of Task 2</Card.Text>
            <Button variant="primary">Complete Task</Button>
          </Card.Body>
        </Card>
        {/* Add more task cards as needed */}
      </Container>
    </>
  );
};

export default TaskPage;

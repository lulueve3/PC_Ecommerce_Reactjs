import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RedeemPage.css"; // Import custom CSS

const TaskPage = () => {
  const [points, setPoints] = useState(30);

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

  useEffect(() => {
    fetchPoints();
  }, []);

  const completeTask = async (missionType) => {
    setPoints(Number(points + Number(10)));

    toast.success(`You gained 10 points!`, {
      position: toast.POSITION.TOP_RIGHT,
    });
    // try {
    //   const accessToken = localStorage.getItem("accessToken") || null;
    //   const response = await axios.post(
    //     `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/rewards/check-mission?missionType=${missionType}`,
    //     {},
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }
    //   );

    //   if (response.data.value) {
    //     const pointsGained = response.data.value;
    //     // fetchPoints();
    //     setPoints(Number(points + Number(response.data.value)));

    //     toast.success(`You gained ${pointsGained} points!`, {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   } else {
    //     console.error("Error completing task:", response.data.message);
    //     toast.error(`Error: ${response.data.message}`, {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error completing task:", error);
    //   toast.error("An error occurred while completing the task.", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // }
  };

  return (
    <>
      <NavigationBar />
      <Container>
        <ToastContainer />
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
            <Card.Title>Like</Card.Title>
            <Card.Text>like a comment</Card.Text>
            <Button variant="primary" onClick={() => completeTask("LIKE")}>
              Complete Task
            </Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Comment</Card.Title>
            <Card.Text>comment on a post</Card.Text>
            <Button variant="primary" onClick={() => completeTask("ANSWER")}>
              Complete Task
            </Button>
          </Card.Body>
        </Card>
        {/* Add more task cards as needed */}
      </Container>
    </>
  );
};

export default TaskPage;

import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RedeemPage.css"; // Import custom CSS

const TaskPage = () => {
  const [points, setPoints] = useState(0);
  const [taskStatus, setTaskStatus] = useState({
    answerCompleted: "NEW",
    likeCompleted: "NEW",
  });

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

  const fetchTaskStatus = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const response = await axios.get(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/rewards/mission",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTaskStatus(response.data);
    } catch (error) {
      console.error("Error fetching task status:", error);
    }
  };

  useEffect(() => {
    fetchPoints();
    fetchTaskStatus();
  }, []);

  const completeTask = async (missionType) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const response = await axios.post(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/rewards/check-mission?missionType=${missionType}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.value) {
        const pointsGained = response.data.value;
        setPoints((prevPoints) => prevPoints + Number(pointsGained));
        // Update task status after completing the task
        fetchTaskStatus();

        toast.success(`You gained ${pointsGained} points!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.error("Error completing task:", response.data.message);
        toast.error(`Error: ${response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error completing task:", error);
      if (error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("An error occurred while completing the task.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case "NEW":
        return "NEW";
      case "COMPLETED":
        return "Task Completed";
      case "CLAIMED":
        return "Claimed";
      default:
        return "";
    }
  };

  const isButtonDisabled = (status) => {
    return status === "COMPLETED" || status === "CLAIMED";
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
            <Card.Text>Like a comment</Card.Text>
            <Button
              variant="primary"
              onClick={() => completeTask("LIKE")}
              disabled={isButtonDisabled(taskStatus.likeCompleted)}
            >
              {getButtonText(taskStatus.likeCompleted)}
            </Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Comment</Card.Title>
            <Card.Text>Comment on a post</Card.Text>
            <Button
              variant="primary"
              onClick={() => completeTask("ANSWER")}
              disabled={isButtonDisabled(taskStatus.answerCompleted)}
            >
              {getButtonText(taskStatus.answerCompleted)}
            </Button>
          </Card.Body>
        </Card>
        {/* Add more task cards as needed */}
      </Container>
    </>
  );
};

export default TaskPage;

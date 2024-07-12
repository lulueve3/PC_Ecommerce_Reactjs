import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";
import TaskPage from "../components/TaskPage";
import RedeemPage from "../components/RedeemPage";

const ExchangePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container>
      <h2>Exchange</h2>
      <Row>
        <Col md={3}>
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/exchange/tasks"
                active={activeTab === "/exchange/tasks"}
                onClick={() => handleTabChange("/exchange/tasks")}
              >
                Tasks
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/exchange/redeem"
                active={activeTab === "/exchange/redeem"}
                onClick={() => handleTabChange("/exchange/redeem")}
              >
                Redeem
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9}>
          {activeTab === "/exchange/tasks" && <TaskPage />}
          {activeTab === "/exchange/redeem" && <RedeemPage />}
        </Col>
      </Row>
    </Container>
  );
};

export default ExchangePage;

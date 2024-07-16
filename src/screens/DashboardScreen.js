import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DashboardScreen = () => {
  const [statistics, setStatistics] = useState({
    userCount: 0,
    orderCount: 0,
    productCount: 0,
    revenue: 0,
  });

  const [selectedYear, setSelectedYear] = useState(2024);
  const [orderReport, setOrderReport] = useState([]);

  const handleChangeYear = (year) => {
    setSelectedYear(year ? year : 2024);

    fetchOrderReport(year);
  };

  useEffect(() => {
    fetchOrderReport(2024);
  }, []);

  const fetchOrderReport = async (year) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/analysis/order/report?startTime=${year}-01-01T00:00:00.000Z&endTime=${
          year + 1
        }-01-01T00:00:00.000Z`,
        config
      );

      const sortedOrderReport = response.data.data.sort((a, b) => {
        // Assuming the format is "YYYY-MM"
        return a[0].localeCompare(b[0]);
      });

      setOrderReport(sortedOrderReport);
    } catch (error) {
      console.error("Error fetching order report:", error);
    }
  };

  const orderChartData = {
    labels: orderReport.map(([month]) => `Time: ${month}`),
    datasets: [
      {
        label: "Revenue",
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.8)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: orderReport.map(([, value]) => parseFloat(value)),
      },
    ],
    options: {
      scales: {
        y: {
          ticks: {
            callback: function (value, index, values) {
              return `$${value.toFixed(2)}`; // Display currency with two decimal places
            },
          },
        },
      },
    },
  };

  const userOrderData = {
    labels: ["Users", "Orders"],
    datasets: [
      {
        data: [statistics.userCount, statistics.orderCount],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
        ],
      },
    ],
  };

  useEffect(() => {
    getProductCount(2024);
    getOrderCount();
    getUserCount();
  }, []);

  const getProductCount = async (year) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/analysis/product?fromTime=${year}-01-01T00:00:00.000Z&toTime=${
          year + 1
        }-01-01T00:00:00.000Z`,
        config
      );

      setStatistics((prevStatistics) => ({
        ...prevStatistics,
        productCount: response.data.total,
      }));
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const dataUserOrder = [
    { label: "User", value: statistics.userCount },
    { label: "Order", value: statistics.orderCount },
  ];

  const dataOrderRevenue = [
    { label: "Order", value: statistics.orderCount },
    { label: "Revenue", value: statistics.revenue },
  ];

  const getUserCount = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/analysis/customer",
        config
      );
      setStatistics((prevStatistics) => ({
        ...prevStatistics,
        userCount: response.data.total,
      }));
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const getOrderCount = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/analysis/order",
        config
      );
      setStatistics((prevStatistics) => ({
        ...prevStatistics,
        orderCount: response.data.total,
        revenue: response.data.totalValue,
      }));
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h1>Admin Dashboard</h1>
      <Row>
        <Col md={3}>
          <Link to="/admin/userList">
            <Card style={{ backgroundColor: "#3e95cd" }} text="white">
              <Card.Body>
                <Card.Title>User Count</Card.Title>
                <Card.Text>{statistics.userCount}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={3}>
          <Link to="/admin/orderList">
            <Card style={{ backgroundColor: "#8e5ea2" }} text="white">
              <Card.Body>
                <Card.Title>Order Count</Card.Title>
                <Card.Text>{statistics.orderCount}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={3}>
          <Link to="/admin/productList">
            <Card bg="primary" text="white">
              <Card.Body>
                <Card.Title>Product Count</Card.Title>
                <Card.Text>{statistics.productCount}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={3}>
          <Link to="/admin/orderList">
            <Card bg="success" text="white">
              <Card.Body>
                <Card.Title>Revenue</Card.Title>
                <Card.Text>{statistics.revenue.toFixed(3)}$</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      <div className="my-5">
        <label>Select Year: </label>
        <DatePicker
          selected={new Date(selectedYear, 0)}
          onChange={(date) => handleChangeYear(date?.getFullYear())}
          dateFormat="yyyy"
          showYearPicker
        />
        <Bar data={orderChartData} />
      </div>
    </Container>
  );
};

export default DashboardScreen;

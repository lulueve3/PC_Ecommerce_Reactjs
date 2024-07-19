import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Pagination, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import RewardModal from "../components/RewardModal";
import "./AdminRewardScreen.css";

const AdminRewardScreen = () => {
  const [rewards, setRewards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const pageSize = 10;

  useEffect(() => {
    fetchRewards(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchRewards = async (page = 0, query = "") => {
    const accessToken = localStorage.getItem("accessToken") || null;
    try {
      const response = await axios.get(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/rewards",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page: page,
            size: pageSize,
            sortBy: "id",
            sortDirection: "DESC",
            keyword: query,
          },
        }
      );
      setRewards(response.data.results);
      setTotalPages(response.data.page.totalPages);
    } catch (error) {
      toast.error("Failed to fetch rewards");
    }
  };

  const handleDisable = async (rewardId) => {
    const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      await axios.patch(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/rewards/${rewardId}`,
        { endAt: new Date().toISOString() },
        config
      );
      toast.success("Reward disabled successfully!");
      fetchRewards(currentPage, searchQuery); // Refresh the list
    } catch (error) {
      toast.error("Error disabling reward: " + error.message);
    }
  };

  const onSave = async (rewardData) => {
    const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      if (currentReward) {
        await axios.patch(
          `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/rewards/${currentReward.id}`,
          rewardData,
          config
        );
      } else {
        await axios.post(
          "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/rewards",
          rewardData,
          config
        );
      }
      toast.success("Reward saved successfully!");
      setShowModal(false);
      fetchRewards(currentPage, searchQuery); // Refresh the list
    } catch (error) {
      toast.error("Error saving reward: " + error.message);
    }
  };

  const renderRewardsTable = () => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Quantity</th>
          <th>Cost</th>
          <th>Start At</th>
          <th>End At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rewards?.map((reward) => (
          <tr
            key={reward.id}
            className={
              new Date(reward.endAt) < new Date() ? "disabled-reward" : ""
            }
          >
            <td>{reward.id}</td>
            <td>{reward.title}</td>
            <td>{reward.quantity}</td>
            <td>{reward.cost * -1}</td>
            <td>{new Date(reward.startAt).toLocaleString()}</td>
            <td>{new Date(reward.endAt).toLocaleString()}</td>
            <td>
              <Button
                variant="primary"
                onClick={() => {
                  setCurrentReward(reward);
                  setShowModal(true);
                }}
              >
                Detail
              </Button>{" "}
              <Button variant="danger" onClick={() => handleDisable(reward.id)}>
                Disable
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderPagination = () => (
    <div className="d-flex justify-content-center">
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index}
            active={index === currentPage}
            onClick={() => setCurrentPage(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Search rewards..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(0); // Reset to the first page on search
        }}
        className="mb-3"
      />
      <Button onClick={() => setShowModal(true)}>Create Reward</Button>
      <RewardModal
        show={showModal}
        onHide={() => setShowModal(false)}
        currentReward={currentReward}
        onSave={onSave}
      />
      <ToastContainer />
      {renderRewardsTable()}
      {renderPagination()}
    </div>
  );
};

export default AdminRewardScreen;

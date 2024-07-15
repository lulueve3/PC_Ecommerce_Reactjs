import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import RewardModal from "../components/RewardModal";

const AdminRewardScreen = () => {
  const [rewards, setRewards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentReward, setCurrentReward] = useState(null); // null for new rewards

  useEffect(() => {
    fetchRewards();
  }, []);

  // Inside AdminRewardScreen component
  const onSave = async (rewardData) => {
    const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      if (currentReward) {
        // If editing, send a PATCH request
        await axios.patch(
          `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/rewards/${currentReward.id}`,
          rewardData,
          config
        );
      } else {
        // If creating a new reward, send a POST request
        await axios.post(
          "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/rewards",
          rewardData,
          config
        );
      }
      toast.success("Reward saved successfully!");
      setShowModal(false);
      fetchRewards(); // Refresh the list
    } catch (error) {
      toast.error("Error saving reward: " + error.message);
    }
  };

  const fetchRewards = async () => {
    const accessToken = localStorage.getItem("accessToken") || null;
    try {
      const response = await axios.get(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/rewards",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page: 0,
            size: 10,
            sortBy: "id",
            sortDirection: "ASC",
          },
        }
      );
      setRewards(response.data.results);
    } catch (error) {
      toast.error("Failed to fetch rewards");
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
          {/* Include other columns as necessary */}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rewards?.map((reward) => (
          <tr key={reward.id}>
            <td>{reward.id}</td>
            <td>{reward.title}</td>
            <td>{reward.quantity}</td>
            <td>{reward.cost * -1}</td>
            <td>{new Date(reward.startAt).toLocaleString()}</td>
            <td>{new Date(reward.endAt).toLocaleString()}</td>
            {/* Render other reward properties as necessary */}
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
              <Button
                variant="danger"
                onClick={() => {
                  // Add your delete handler here
                }}
              >
                Disable
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  // Handler functions for POST, DELETE, PATCH, and opening the modal would go here...

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Create Reward</Button>
      <RewardModal
        show={showModal}
        onHide={() => setShowModal(false)}
        currentReward={currentReward}
        onSave={onSave}
      />
      <ToastContainer />
      {renderRewardsTable()}
    </div>
  );
};

export default AdminRewardScreen;

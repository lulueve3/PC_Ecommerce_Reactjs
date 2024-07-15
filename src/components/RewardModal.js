import React, { useState, useEffect } from "react";
import { Button, Modal, Form, InputGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const RewardModal = ({ show, onHide, currentReward, onSave }) => {
  const navigate = useNavigate();

  const [discountChecked, setDiscountChecked] = useState(false);
  const [isDiscountValid, setIsDiscountValid] = useState(false);

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Format dates to local datetime inputs
  const formatDate = (date) => {
    return date.toISOString().slice(0, 16); // Cut off seconds and milliseconds
  };

  const [rewardData, setRewardData] = useState({
    title: currentReward ? currentReward.title : "",
    quantity: currentReward ? currentReward.quantity : 1,
    cost: currentReward ? currentReward.cost : 1,
    startAt: currentReward ? currentReward.startAt : formatDate(now),
    endAt: currentReward ? currentReward.endAt : formatDate(tomorrow),
    priceRuleTitle: currentReward ? currentReward.priceRuleTitle : "",
  });

  const handleCreateDiscountClick = () => {
    navigate("/admin/discount");
  };

  const handleCheckDiscount = async (priceRuleTitle) => {
    try {
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/discounts/${priceRuleTitle}`
      );

      // Get the current time
      const now = new Date();

      // Parse discount start and end times

      // Check if the discount is valid and that the current time is within the discount time range
      if (response.data.title) {
        const startTime = new Date(response.data.startTime);
        const endTime = new Date(response.data.endTime);
        if (response.data.title && now >= startTime && now <= endTime) {
          setIsDiscountValid(true);
          toast.success("Discount is valid");
        } else {
          setIsDiscountValid(false);
          if (now < startTime) {
            toast.info("Discount is valid but not started yet.");
          } else if (now > endTime) {
            toast.info("Discount has expired.");
          } else {
            toast.error("Discount is not valid!");
          }
        }
      } else {
        setIsDiscountValid(false);
        toast.error("Discount is not valid!");
      }
    } catch (error) {
      setIsDiscountValid(false);
      toast.error("Failed to verify discount: " + error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentReward) {
      setRewardData(currentReward);
    }
  }, [currentReward]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRewardData({ ...rewardData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedData = {
      ...rewardData,
      startAt: new Date(rewardData.startAt).toISOString(),
      endAt: new Date(rewardData.endAt).toISOString(),
      cost: rewardData.cost * -1,
    };
    onSave(formattedData);
    onHide(); // Hide the modal after submitting
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentReward ? "Edit Reward" : "Create Reward"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="rewardTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required
                value={rewardData.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="rewardQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                required
                min="1"
                value={rewardData.quantity}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="rewardCost">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                name="cost"
                required
                min="1"
                value={rewardData.cost}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="rewardPriceRuleTitle">
              <Form.Label>Price Rule Title</Form.Label>
              <Form.Control
                type="text"
                name="priceRuleTitle"
                required
                value={rewardData.priceRuleTitle}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                className="m-2"
                onClick={() => handleCheckDiscount(rewardData.priceRuleTitle)}
              >
                Check Discount
              </Button>
              <Button
                variant="primary"
                className="m-2"
                onClick={handleCreateDiscountClick}
              >
                Create Discount
              </Button>
            </div>
            <Form.Group controlId="rewardStartAt">
              <Form.Label>Start At</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startAt"
                required
                value={rewardData.startAt}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="rewardEndAt">
              <Form.Label>End At</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endAt"
                required
                value={rewardData.endAt}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* ...other form groups... */}
            <Button variant="primary" type="submit" disabled={!isDiscountValid}>
              {currentReward ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RewardModal;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const DiscountModal = ({
  show,
  handleClose,
  discount,
  setDiscount,
  isNew,
  onSubmitSuccess,
}) => {
  const [allMember, setAllMember] = useState(true);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "prerequisiteCustomerIds") {
      //   console.log(checked ? [] : [1]);
      console.log(discount.prerequisiteCustomerIds);
      setAllMember(checked);
      setDiscount({ ...discount, prerequisiteCustomerIds: checked ? [] : [1] });
    } else {
      if (name === "valueType" && value === "PERCENTAGE") {
        setDiscount({ ...discount, value: -1, valueType: value });
      } else if (name === "value" && discount?.valueType === "PERCENTAGE") {
        const newValue = Math.min(Math.abs(value), 100);
        setDiscount({ ...discount, value: -newValue });
      } else if (name === "value" || name === "maxDiscountValue") {
        setDiscount({ ...discount, [name]: -Math.abs(value) });
      } else {
        setDiscount({ ...discount, [name]: value });
      }
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const defaultDiscountValues = {
    title: "",
    usageLimit: 1,
    value: -1,
    valueType: "PERCENTAGE",
    maxDiscountValue: -1,
    prerequisiteQuantityRange: 1,
    prerequisiteSubtotalRange: 1,
    startTime: Date.now(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    prerequisiteCustomerIds: [],
  };
  useEffect(() => {
    if (isNew && discount?.usageLimit === 0) {
      setDiscount(defaultDiscountValues);
    }

    if (
      !discount?.prerequisiteCustomerIds ||
      discount.prerequisiteCustomerIds.length === 0
    ) {
      setAllMember(true);
    } else {
      setAllMember(false);
    }
  }, [isNew, discount, setDiscount]);

  const handleSubmit = async () => {
    const discountData = {
      ...discount,
      value: discount.value ? -Math.abs(discount.value) : discount.value,
      maxDiscountValue: discount.maxDiscountValue
        ? -Math.abs(discount.maxDiscountValue)
        : discount.maxDiscountValue,
      startTime: discount.startTime
        ? new Date(discount.startTime).toISOString()
        : undefined,
      endTime: discount.endTime
        ? new Date(discount.endTime).toISOString()
        : undefined,
    };

    console.log(discountData);

    const accessToken = localStorage.getItem("accessToken") || null;

    try {
      const response = isNew
        ? await axios.post(
            "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/price_rules",
            discountData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        : await axios.put(
            `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/price_rules/${discount.id}`,
            discountData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

      handleClose();
      toast.success("Discount saved successfully!");
      onSubmitSuccess();
    } catch (error) {
      console.error("There was an error saving the discount:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message.includes("price_rule_title_key")
      ) {
        toast.error(
          "The discount title already exists. Please use a different title."
        );
      } else {
        toast.error(
          error.response.data?.message || "An unknown error occurred."
        );
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isNew ? "Add Discount" : "Edit Discount"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="discountTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={discount?.title}
              onChange={handleInputChange}
              readOnly={!isNew}
            />
          </Form.Group>

          <Form.Group controlId="discountUsageLimit">
            <Form.Label>Usage Limit</Form.Label>
            <Form.Control
              type="number"
              name="usageLimit"
              value={discount?.usageLimit}
              onChange={handleInputChange}
              min="1"
              disabled={!isNew}
            />
          </Form.Group>

          <Form.Group controlId="discountValue">
            <Form.Label>Discount Value</Form.Label>
            <Form.Control
              type="number"
              name="value"
              value={Math.abs(discount?.value || 1)}
              onChange={handleInputChange}
              min="1"
              max={discount?.valueType === "PERCENTAGE" ? 100 : undefined}
              readOnly={!isNew}
            />
          </Form.Group>

          <Form.Group controlId="discountValueType">
            <Form.Label>Value Type</Form.Label>
            <Form.Control
              as="select"
              name="valueType"
              value={discount?.valueType}
              onChange={handleInputChange}
              disabled={!isNew}
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="discountMaxDiscountValue">
            <Form.Label>Max Discount Value</Form.Label>
            <Form.Control
              type="number"
              name="maxDiscountValue"
              value={Math.abs(discount?.maxDiscountValue)}
              onChange={handleInputChange}
              min="1"
              readOnly={!isNew}
            />
          </Form.Group>

          <Form.Group controlId="discountPrerequisiteQuantityRange">
            <Form.Label>Prerequisite Quantity Range</Form.Label>
            <Form.Control
              type="number"
              name="prerequisiteQuantityRange"
              value={discount?.prerequisiteQuantityRange}
              onChange={handleInputChange}
              min="1"
              readOnly={!isNew}
            />
          </Form.Group>

          <Form.Group controlId="discountPrerequisiteSubtotalRange">
            <Form.Label>Prerequisite Subtotal Range</Form.Label>
            <Form.Control
              type="number"
              name="prerequisiteSubtotalRange"
              value={discount?.prerequisiteSubtotalRange}
              onChange={handleInputChange}
              min="1"
              readOnly={!isNew}
            />
          </Form.Group>

          <Form.Group controlId="discountAllMember">
            <Form.Check
              name="prerequisiteCustomerIds"
              type="checkbox"
              label="All Member"
              checked={allMember}
              onChange={handleInputChange}
              readOnly={!isNew}
            />
          </Form.Group>

          <Form.Group controlId="discountStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startTime"
              value={formatDateForInput(discount?.startTime)}
              onChange={handleInputChange}
              readOnly={!isNew}
            />
          </Form.Group>

          <Form.Group controlId="discountEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endTime"
              value={formatDateForInput(discount?.endTime)}
              onChange={handleInputChange}
              readOnly={!isNew}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" hidden={!isNew} onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DiscountModal;

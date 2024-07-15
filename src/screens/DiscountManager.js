import React, { useState, useEffect } from "react";
import { Button, Table, Pagination } from "react-bootstrap";
import DiscountModal from "../components/DiscountModal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./DiscountManager.css";

const DiscountManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Updated fetchDiscounts function to include pagination
  const fetchDiscounts = async (page = 0) => {
    const size = 7;
    const accessToken = localStorage.getItem("accessToken") || null;
    try {
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/price_rules?page=${page}&size=${size}&sortDirection=DESC`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDiscounts(response.data.results || []);
      setTotalPages(response.data.page.totalPages); // Update total pages
      setCurrentPage(response.data.page.number); // Update current page
    } catch (error) {
      console.error("Error fetching discounts:", error);
      toast.error("Error fetching discounts. Please try again.");
    }
  };

  const handleDiscountUpdated = () => {
    fetchDiscounts(currentPage);
  };

  useEffect(() => {
    fetchDiscounts(currentPage);
  }, [currentPage]);

  const renderPagination = () => {
    let items = [];
    for (let number = 0; number < totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number + 1}
        </Pagination.Item>
      );
    }
    return (
      <div className="d-flex justify-content-center">
        <Pagination>{items}</Pagination>
      </div>
    );
  };

  const handleDisable = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const updatedDiscount = {
        endTime: new Date().toISOString(), // Set the end time to now
      };
      await axios.put(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/price_rules/${id}`,
        updatedDiscount,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Discount disabled successfully!");
      handleDiscountUpdated();
    } catch (error) {
      console.error("Error disabling the discount:", error);
      toast.error("Error disabling discount. Please try again.");
    }
  };

  const handleShowModal = (discount) => {
    setCurrentDiscount(
      discount || {
        // New discount default values
        title: "",
        usageLimit: 0,
        value: 0,
        valueType: "PERCENTAGE",
        maxDiscountValue: 0,
        prerequisiteQuantityRange: 0,
        prerequisiteSubtotalRange: 0,
        prerequisiteCustomerIds: [],
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      }
    );
    setIsNew(!discount);
    setShowModal(true);
  };

  const handleEdit = (discount) => {
    handleShowModal(discount);
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      await axios.delete(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/price_rules/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDiscounts(discounts.filter((discount) => discount.id !== id));
      toast.success("Discount deleted successfully!");
    } catch (error) {
      console.error("Error deleting the discount:", error);
      toast.error("Error deleting discount. Please try again.");
    }
  };

  const renderDiscountsTable = () => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Value</th>
          <th>Value Type</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {discounts?.map((discount) => {
          const isInvalid =
            discount.usageLimit < 1 || new Date(discount.endTime) < new Date();
          const discountClass = isInvalid ? "invalid-discount" : "";

          return (
            <tr key={discount.id}>
              <td className={discountClass}>{discount.title}</td>
              <td className={discountClass}>{discount.value * -1}</td>
              <td className={discountClass}>{discount.valueType}</td>
              <td className={discountClass}>
                {new Date(discount.startTime).toLocaleString()}
              </td>
              <td className={discountClass}>
                {new Date(discount.endTime).toLocaleString()}
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleEdit(discount)}
                  disabled={isInvalid}
                >
                  Detail
                </Button>{" "}
                <Button
                  variant="warning"
                  onClick={() => handleDisable(discount.id)}
                  disabled={isInvalid}
                >
                  Disable
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );

  return (
    <>
      <ToastContainer />
      <Button variant="primary" onClick={() => handleShowModal(null)}>
        Add Discount
      </Button>
      {renderDiscountsTable()}
      {renderPagination()}
      <DiscountModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        discount={currentDiscount}
        setDiscount={setCurrentDiscount}
        handleSubmit={() => {}} // Implement submission logic here
        isNew={isNew}
        onSubmitSuccess={handleDiscountUpdated}
      />
    </>
  );
};

export default DiscountManager;

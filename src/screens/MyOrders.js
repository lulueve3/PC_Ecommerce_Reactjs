import React, { useState, useEffect } from "react";
import { Table, Pagination, Modal, Button, Toast } from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const formatTime = (time) => {
    return format(new Date(time), "dd/MM/yyyy HH:mm:ss");
  };

  const fetchOrders = async (page = 0, size = 10) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/orders?page=${page}&size=${size}&sortBy=id&sortDirection=DESC`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setOrders(response.data.results);
      setTotalPages(response.data.page.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProductDetailsForOrder = async (order) => {
      const productDetailsPromises = order.lineItems.map(async (item) => {
        const productId = item.productId;
        await fetchProductDetails(productId);
      });

      await Promise.all(productDetailsPromises);
    };

    orders?.forEach((order) => {
      fetchProductDetailsForOrder(order);
    });
  }, [orders]);

  const fetchProductDetails = async (productId) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setProductDetails((prevProductDetails) => [
        ...prevProductDetails,
        response.data,
      ]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      await axios.patch(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/orders/${orderId}`,
        { fulfillmentStatus: "REQUESTED_FOR_CANCELLATION" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, fulfillmentStatus: "REQUESTED_FOR_CANCELLATION" }
            : order
        )
      );

      // Set toast message and show it
      setToastMessage(
        "Please contact us via email to request cancellation. HHCOMPUTER@gmail.com"
      );
      setShowToast(true);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber - 1);
  };

  const handleViewDetails = async (orderId) => {
    const order = orders.find((order) => order.id === orderId);

    if (order) {
      setSelectedOrder(order);

      const productIds = order.productIds || [];
      await Promise.all(productIds.map(fetchProductDetails));

      setShowModal(true);
    } else {
      console.error("Order not found");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const totalOrderById = (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    const totalDiscount =
      order?.discountApplications?.reduce((acc, discount) => {
        if (discount.valueType === "FIXED_AMOUNT") {
          return acc + discount.value;
        } else if (discount.valueType === "PERCENTAGE") {
          return acc + order?.subtotalPrice * (discount.value / 100);
        }
        return acc;
      }, 0) || 0;
    return (order?.subtotalPrice + totalDiscount).toFixed(2);
  };

  const getOrderProducts = (orderId) => {
    const order = orders.find((order) => order.id === orderId);

    if (!order) return null;

    return (
      <div>
        <h5>Order Details</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Image</th>
              <th>Variant</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {order.lineItems?.map((item) => {
              const product = productDetails.find(
                (product) => product.id === item.productId
              );
              const variant = product?.variants.find(
                (variant) => variant.id === item.variantId
              );

              return (
                <tr key={item.productId}>
                  <td>{product ? product.title : "Product Not Found"}</td>
                  <td>
                    {product ? (
                      <img
                        src={
                          product.image
                            ? product.image.src
                            : "URL_DEFAULT_IMAGE"
                        }
                        alt={product.title || "Product Image"}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    ) : (
                      "Product Not Found"
                    )}
                  </td>
                  <td>{item.variantTitle || "No Options"}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {order?.discountApplications &&
          order.discountApplications.length > 0 && (
            <div>
              <h6>
                Discount Codes:{" "}
                {order.discountApplications
                  .map((discount) => discount.discountCode)
                  .join(", ")}
              </h6>
            </div>
          )}
        <div>
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: 14 }}>
            Address: {order.address.name}, {order.address.street},{" "}
            {order.address.ward}, {order.address.district}, {order.address.city}
          </p>
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: 14 }}>
            Phone: {order.address.phone}
          </p>
        </div>
        <div>
          <h5>
            Total Amount:{" "}
            {order?.subtotalPrice !== totalOrderById(order.id) ? (
              <span style={{ textDecoration: "line-through" }}>
                ${order?.subtotalPrice.toFixed(2)}
              </span>
            ) : (
              <span></span>
            )}{" "}
            <span style={{ color: "green" }}>${totalOrderById(order.id)}</span>
          </h5>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>My Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>Created Time</th>
            <th>Status</th>
            <th>Details</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{`${order.address.name}`}</td>
              <td>{totalOrderById(order.id)}</td>
              <td>{formatTime(order.createdAt)}</td>
              <td>{order.fulfillmentStatus}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleViewDetails(order.id)}
                >
                  Details
                </Button>
              </td>
              <td>
                {order.fulfillmentStatus !== "REQUESTED_FOR_CANCELLATION" &&
                  order.fulfillmentStatus !== "CANCELLED" && (
                    <Button
                      variant="danger"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel
                    </Button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <h5>Order ID: {selectedOrder.id}</h5>
              <div>{getOrderProducts(selectedOrder.id)}</div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={10000}
        autohide
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "yellow",
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default MyOrders;

import React, { useState, useEffect } from "react";
import { Table, Pagination, Modal, Button } from "react-bootstrap";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { format } from "date-fns";
import "./AdminOrderScreen.css";

import axios from "axios";

const AdminOrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [orderCounts, setOrderCounts] = useState([]);
  const [fulfillmentStatusFilter, setFulfillmentStatusFilter] = useState("ANY"); // State for fulfillment status filter

  const getClassByFulfillmentStatus = (status) => {
    switch (status) {
      case "UNFULFILLED":
        return "tr-unfulfilled";
      case "FULFILLED":
        return "tr-fulfilled";
      case "SHIPPED":
        return "tr-shipped";
      default:
        return "";
    }
  };

  const FulfillmentStatus = {
    ANY: "ANY",
    UNFULFILLED: "UNFULFILLED",
    FULFILLED: "FULFILLED",
    SHIPPED: "SHIPPED",
  };

  const fetchOrders = async (
    page = 0,
    size = 10,
    fulfillmentStatus = "ANY"
  ) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      let apiUrl = `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/orders?page=${page}&size=${size}&sortBy=id&sortDirection=DESC`;

      if (fulfillmentStatus !== "ANY") {
        apiUrl += `&fulfillmentStatus=${fulfillmentStatus}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setOrders(response.data.results);
      setTotalPages(response.data.page.totalPages);

      // Đếm số lượng đơn hàng theo fulfillmentStatus
      const counts = response.data.results.reduce((acc, order) => {
        acc[order.fulfillmentStatus] = (acc[order.fulfillmentStatus] || 0) + 1;
        return acc;
      }, {});
      setOrderCounts(counts);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      // Tìm đơn hàng trong state dựa trên orderId
      const orderToUpdate = orders.find((order) => order.id === orderId);

      if (!orderToUpdate) {
        console.error("Order not found");
        return;
      }

      // Cập nhật chỉ trạng thái fulfillmentStatus, giữ nguyên các thông tin khác
      const updatedOrderPayload = {
        ...orderToUpdate, // Sử dụng spread operator để sao chép tất cả thông tin hiện có
        fulfillmentStatus: newStatus, // Cập nhật chỉ trạng thái mới cho fulfillmentStatus
      };

      // Xóa các thông tin không cần thiết trước khi gửi payload
      delete updatedOrderPayload.id;
      delete updatedOrderPayload.createdAt;
      delete updatedOrderPayload.updatedAt;
      delete updatedOrderPayload.discountApplications;
      delete updatedOrderPayload.lineItems;
      delete updatedOrderPayload.subtotalPrice;
      delete updatedOrderPayload.totalDiscountPrice;
      delete updatedOrderPayload.totalPrice;

      // Gọi API cập nhật trạng thái đơn hàng
      await axios.patch(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/orders/${orderId}`,
        updatedOrderPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Cập nhật state của orders để phản ánh thay đổi trên giao diện người dùng
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, fulfillmentStatus: newStatus } // Cập nhật trạng thái mới
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber - 1, 10, fulfillmentStatusFilter);
  };

  const handleFulfillmentStatusChange = (event) => {
    setFulfillmentStatusFilter(event.target.value);
  };

  useEffect(() => {
    fetchOrders(0, 10, fulfillmentStatusFilter);
  }, [fulfillmentStatusFilter]);

  const findVariantById = (productId, variantId) => {
    const product = productDetails.find((product) => product.id === productId);
    if (product) {
      return product.variants.find((variant) => variant.id === variantId);
    }
    return null;
  };

  const getOrderProducts = (orderId) => {
    const order = orders.find((order) => order.id === orderId);

    const totalDiscount =
      order.discountApplications?.reduce((acc, discount) => {
        if (discount.valueType === "FIXED_AMOUNT") {
          return acc + discount.value;
        } else if (discount.valueType === "PERCENTAGE") {
          return acc + order.subtotalPrice * (discount.value / 100);
        }
        return acc;
      }, 0) || 0;

    const discountedTotal = order.subtotalPrice + totalDiscount;

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
              const variant = findVariantById(item.productId, item.variantId);
              console.log(variant);

              return (
                <tr key={item.productId}>
                  <td
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                    }}
                  >
                    {product ? product.title : "Product Not Found"}
                  </td>
                  <td>
                    {product ? (
                      <img
                        src={
                          product.image
                            ? product.image.src
                            : "URL_DEFAULT_IMAGE"
                        } // Thay thế 'URL_DEFAULT_IMAGE' bằng URL hình ảnh mặc định nếu không có hình ảnh
                        alt={product.title || "Product Image"}
                        style={{ maxWidth: "100px", maxHeight: "100px" }} // Thay đổi kích thước hình ảnh tùy ý
                      />
                    ) : (
                      "Product Not Found"
                    )}
                  </td>
                  <td>
                    {variant && (
                      <>
                        {variant.option1 && (
                          <span>{variant.option1 + "-"}</span>
                        )}
                        {variant.option2 && (
                          <span>{variant.option2 + "-"}</span>
                        )}
                        {variant.option3 && (
                          <span>{variant.option3 + "-"}</span>
                        )}
                        {!variant.option1 &&
                          !variant.option2 &&
                          !variant.option3 && <span>No Options</span>}
                      </>
                    )}
                    {!variant && "Variant Not Found"}
                  </td>
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
                {order.discountApplications.map(
                  (discount, index) => discount.discountCode
                )}
              </h6>
            </div>
          )}
        <div>
          <h6>
            Address: {order.address.name}, {order.address.street},{" "}
            {order.address.ward}, {order.address.district}, {order.address.city}
          </h6>
          <h6>Phone: {order.address.phone}</h6>
        </div>
        <div>
          <h5>
            Total Amount:{" "}
            {order.subtotalPrice !== discountedTotal ? (
              <span style={{ textDecoration: "line-through" }}>
                ${order.subtotalPrice.toFixed(2)}
              </span>
            ) : (
              <span></span>
            )}{" "}
            <span style={{ color: "green" }}>
              ${discountedTotal.toFixed(2)}
            </span>
          </h5>
        </div>
      </div>
    );
  };

  const handleViewDetails = async (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    setSelectedOrder(order);

    // Gọi fetchProductDetails cho từng productId trong line_items
    order.lineItems.forEach(async (item) => {
      await fetchProductDetails(item.productId);
    });

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatTime = (time) => {
    const dateObject = new Date(time);
    return format(dateObject, "dd/MM/yyyy HH:mm:ss"); // Có thể sửa đổi định dạng tùy ý
  };

  const totalOrderById = (orderId) => {
    const order = orders.find((order) => order.id === orderId);

    const totalDiscount =
      order.discountApplications?.reduce((acc, discount) => {
        if (discount.valueType === "FIXED_AMOUNT") {
          return acc + discount.value;
        } else if (discount.valueType === "PERCENTAGE") {
          return acc + order.subtotalPrice * (discount.value / 100);
        }
        return acc;
      }, 0) || 0;

    return order.subtotalPrice + totalDiscount;
  };

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

  return (
    <div>
      <h2>Orders</h2>

      <DropdownButton
        id="filter-fulfillment-status"
        title={`Filter by Fulfillment Status: ${fulfillmentStatusFilter}`}
      >
        {Object.values(FulfillmentStatus).map((status) => (
          <Dropdown.Item
            key={status}
            onClick={() => setFulfillmentStatusFilter(status)}
          >
            {status}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>Created Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{`${order.address.name}`}</td>
              <td>{totalOrderById(order.id)}</td>
              <td>{formatTime(order.createdAt)}</td>
              <td>
                <div className="d-flex align-items-center">
                  <DropdownButton
                    id={`dropdown-button-${order.id}`}
                    title={order.fulfillmentStatus}
                    className="mr-2" // Để tạo khoảng cách giữa Dropdown và Button
                  >
                    {order.fulfillmentStatus === "UNFULFILLED" && (
                      <Dropdown.Item
                        onClick={() => changeOrderStatus(order.id, "FULFILLED")}
                      >
                        Mark as Fulfilled
                      </Dropdown.Item>
                    )}
                    {/* Hiển thị các Dropdown.Item phù hợp với trạng thái khác */}
                    {order.fulfillmentStatus === "FULFILLED" && (
                      <Dropdown.Item
                        onClick={() => changeOrderStatus(order.id, "SHIPPED")}
                      >
                        Mark as SHIPPED
                      </Dropdown.Item>
                    )}
                  </DropdownButton>
                  <Button onClick={() => handleViewDetails(order.id)}>
                    Details
                  </Button>
                </div>
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
              <p>Email: {selectedOrder.customer.email} </p>
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
    </div>
  );
};

export default AdminOrderScreen;

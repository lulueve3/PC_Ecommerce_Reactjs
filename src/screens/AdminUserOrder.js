import React, { useState, useEffect } from "react";
import { Table, Pagination, Modal, Button } from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { id } = useParams();

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState([]);

  const formatTime = (time) => {
    const dateObject = new Date(time);
    return format(dateObject, "dd/MM/yyyy HH:mm:ss"); // Có thể sửa đổi định dạng tùy ý
  };

  const fetchOrders = async (page = 0, size = 10) => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const response = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/admin/customers/${id}/orders?page=${page}&size=${size}&sortBy=id&sortDirection=DESC`,
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

  const getProductsByOrderId = (orderId) => {
    const order = orders.find((order) => order.id === orderId);

    if (!order) {
      return [];
    }

    const productIdsInOrder = order.lineItems.map((item) => item.productId);

    const productsInOrder = productDetails.filter((product) =>
      productIdsInOrder.includes(product.id)
    );

    return productsInOrder;
  };

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
      order?.discountApplications?.reduce((acc, discount) => {
        if (discount.valueType === "FIXED_AMOUNT") {
          return acc + discount.value;
        } else if (discount.valueType === "PERCENTAGE") {
          return acc + order?.subtotalPrice * (discount.value / 100);
        }
        return acc;
      }, 0) || 0;

    const discountedTotal = order?.subtotalPrice + totalDiscount;

    return (
      <div>
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
                  <td>
                    {item?.variantTitle ? (
                      <>{item.variantTitle}</>
                    ) : (
                      <span>No Options</span>
                    )}
                  </td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {order?.discountApplications &&
          order?.discountApplications.length > 0 && (
            <div>
              <h6>
                Discount Codes:{" "}
                {order?.discountApplications.map(
                  (discount, index) => discount.discountCode
                )}
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
            {order?.subtotalPrice !== discountedTotal ? (
              <span style={{ textDecoration: "line-through" }}>
                ${order?.subtotalPrice.toFixed(2)}
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
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber - 1);
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

  const totalOrderAmount = (order) => {
    let sum = 0;

    if (order) {
      order.lineItems.forEach((item) => {
        sum += item.price * item.quantity;
      });
    }

    return sum;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>User Orders: ID: {id}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>Created Time</th>
            <th>Actions</th>
            {/* Thêm các cột khác tùy thuộc vào dữ liệu đơn hàng */}
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
                <Button
                  variant="info"
                  onClick={() => handleViewDetails(order.id)}
                >
                  View Details
                </Button>
              </td>
              {/* Thêm các cột khác tùy thuộc vào dữ liệu đơn hàng */}
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
              <div>
                {/* Hiển thị thông tin chi tiết của từng sản phẩm trong đơn hàng */}
                {getOrderProducts(selectedOrder.id)}
              </div>
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

export default MyOrders;

import React, { useState, useEffect } from 'react';
import { Table, Pagination, Modal, Button } from 'react-bootstrap';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import axios from 'axios';

const AdminOrderScrren = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [productDetails, setProductDetails] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [orderCounts, setOrderCounts] = useState([]);

    const FulfillmentStatus = {
        SHIPPED: 'SHIPPED',
        PARTIAL: 'PARTIAL',
        UNSHIPPED: 'UNSHIPPED',
        ANY: 'ANY',
        UNFULFILLED: 'UNFULFILLED'
    };

    const [fulfillmentStatusFilter, setFulfillmentStatusFilter] = useState(FulfillmentStatus.UNFULFILLED); // State for fulfillment status filter




    const fetchOrders = async (page = 0, size = 10) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;
            const response = await axios.get(`http://localhost:8080/api/admin/orders?page=${page}&size=${size}&sortBy=id&sortDirection=DESC`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
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
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {

        fetchOrders();
    }, []);




    const changeOrderStatus = async (orderId, newStatus) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;

            // Tìm đơn hàng trong state dựa trên orderId
            const orderToUpdate = orders.find(order => order.id === orderId);

            if (!orderToUpdate) {
                console.error('Order not found');
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
            await axios.patch(`http://localhost:8080/api/admin/orders/${orderId}`, updatedOrderPayload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            // Cập nhật state của orders để phản ánh thay đổi trên giao diện người dùng
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, fulfillmentStatus: newStatus } // Cập nhật trạng thái mới
                        : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchOrders(pageNumber - 1);
    };

    const findVariantById = (productId, variantId) => {
        const product = productDetails.find((product) => product.id === productId);
        if (product) {
            return product.variants.find((variant) => variant.id === variantId);
        }
        return null;
    };

    const handleFulfillmentStatusChange = (event) => {
        setFulfillmentStatusFilter(event.target.value);
        fetchOrders(0, 10, event.target.value);
    };

    useEffect(() => {
        fetchOrders(0, 10, fulfillmentStatusFilter);
    }, [fulfillmentStatusFilter]);



    const getOrderProducts = (orderId) => {
        const order = orders.find((order) => order.id === orderId);

        console.log(order);

        return (
            <div>
                <h5>Order Details</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Image</th>
                            <th>Variant Title</th>
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
                                    <td style={{
                                        display: 'block',
                                        maxWidth: '100%',
                                        wordWrap: 'break-word',
                                        wordBreak: 'break-all'
                                    }}>
                                        {product ? product.title : 'Product Not Found'}
                                    </td>
                                    <td>
                                        {product && product.image ? (
                                            <img
                                                src={product.image.src}
                                                alt={product.title || 'Product Image'}
                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                    <td>{variant ? variant.title : 'Variant Not Found'}</td>
                                    <td>${item.price}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    };



    const handleViewDetails = async (orderId) => {
        const order = orders.find(order => order.id === orderId);
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

    const totalOrderById = (orderId) => {
        const order = orders.find(order => order.id === orderId);

        if (order) {
            return order.subtotalPrice;
        }

        return 0;
    };

    const fetchProductDetails = async (productId) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;
            const response = await axios.get(`http://localhost:8080/api/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setProductDetails(prevProductDetails => [...prevProductDetails, response.data]);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    return (
        <div>
            <h2>My Orders</h2>
            <DropdownButton id="filter-dropdown" title={`Filter by Status: ${filterStatus}`}>
                <Dropdown.Item onClick={() => setFilterStatus("All")}>All</Dropdown.Item>
                {Object.keys(orderCounts).map(status => (
                    <Dropdown.Item key={status} onClick={() => setFilterStatus(status)}>
                        {status} ({orderCounts[status]})
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
                    {orders?.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{`${order.address.name}`}</td>
                            <td>{totalOrderById(order.id)}</td>
                            <td>{order.createdAt}</td>
                            <td>
                                <DropdownButton id={`dropdown-button-${order.id}`} title={order.fulfillmentStatus}>
                                    {order.fulfillmentStatus === "UNFULFILLED" && (
                                        <Dropdown.Item onClick={() => changeOrderStatus(order.id, "FULFILLED")}>Mark as Fulfilled</Dropdown.Item>
                                    )}
                                    {order.fulfillmentStatus === "FULFILLED" && (
                                        <Dropdown.Item onClick={() => changeOrderStatus(order.id, "UNFULFILLED")}>Mark as Unfulfilled</Dropdown.Item>
                                    )}
                                </DropdownButton>
                                <Button onClick={() => handleViewDetails(order.id)}>Details</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className='d-flex justify-content-center'>
                <Pagination>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                        <Pagination.Item
                            key={pageNumber}
                            active={pageNumber === currentPage}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <h5>Order ID: {selectedOrder.id}</h5>
                            <p>Total Amount: ${totalOrderById(selectedOrder.id)}</p>
                            <p>Email: {selectedOrder.customer.email} </p>
                            <div>
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

export default AdminOrderScrren;

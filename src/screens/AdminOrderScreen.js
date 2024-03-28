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
    const [filterStatus, setFilterStatus] = useState("All"); // Thêm state để lưu trữ trạng thái lọc
    const [orderCounts, setOrderCounts] = useState([
        { status: "New", count: 0 },
        { status: "Accept", count: 0 },
        { status: "Shipping", count: 0 },
        { status: "Done", count: 0 }
    ]);

    // Tính số lượng đơn hàng ở mỗi trạng thái
    useEffect(() => {
        const countOrdersByStatus = () => {
            const counts = [
                { status: "New", count: 0 },
                { status: "Accept", count: 0 },
                { status: "Shipping", count: 0 },
                { status: "Done", count: 0 }
            ];

            orders.forEach(order => {
                const index = counts.findIndex(item => item.status === order.status);
                if (index !== -1) {
                    counts[index].count++;
                }
            });

            setOrderCounts(counts);
        };

        countOrdersByStatus();
    }, [orders]);


    const filterOrdersByStatus = (status) => {
        if (status === "All") {
            setOrders(sampleOrders); // Hiển thị tất cả đơn hàng nếu lọc theo "All"
        } else {
            const filteredOrders = sampleOrders.filter(order => order.status === status);
            setOrders(filteredOrders); // Hiển thị đơn hàng phù hợp với trạng thái được chọn
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const sampleOrders = [
        {
            id: 1,
            address: {
                first_name: "John",
                last_name: "Doe"
            },
            line_items: [
                {
                    productId: 1,
                    variantId: 1,
                    price: 10,
                    quantity: 2
                },
                {
                    productId: 2,
                    variantId: 1,
                    price: 15,
                    quantity: 1
                }
            ],
            created_time: "2024-03-27 10:00:00",
            status: "New" // Thêm trạng thái cho đơn hàng mới
        },
        {
            id: 2,
            address: {
                first_name: "Jane",
                last_name: "Smith"
            },
            line_items: [
                {
                    productId: 3,
                    variantId: 1,
                    price: 20,
                    quantity: 3
                }
            ],
            created_time: "2024-03-26 14:30:00",
            status: "New" // Thêm trạng thái cho đơn hàng mới
        },
        // Add more sample orders here...
    ];

    const changeOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const getOrderStatusColor = (status) => {
        switch (status) {
            case "New":
                return "yellow";
            case "Accept":
                return "purple";
            case "Shipping":
                return "orange";
            case "Done":
                return "green";
            default:
                return "";
        }
    };



    const fetchOrders = async (page = 0, size = 10) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;
            const response = await axios.get(`http://localhost:8080/api/admin/orders?page=${page}&size=${size}&sortBy=id&sortDirection=DESC`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            //setOrders(response.data.results);

            setTotalPages(response.data.page.totalPages);
        } catch (error) {
            setOrders(sampleOrders)
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        const fetchProductDetailsForOrder = async (order) => {
            const productDetailsPromises = order.line_items.map(async (item) => {
                const productId = item.productId;
                await fetchProductDetails(productId);
            });

            await Promise.all(productDetailsPromises);
        };

        orders?.forEach((order) => {
            fetchProductDetailsForOrder(order);
        });
    }, [orders]);


    const getProductsByOrderId = (orderId) => {
        const order = orders.find((order) => order.id === orderId);

        if (!order) {
            return [];
        }

        const productIdsInOrder = order.line_items.map((item) => item.productId);

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

    const getOrderProduct = (orderId) => {
        const order = orders.find((order) => order.id === orderId);

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
                        {order.line_items.map((item) => {
                            const product = productDetails.find(
                                (product) => product.id === item.productId
                            );
                            const variant = findVariantById(item.productId, item.variantId);
                            console.log(variant);

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
                                        {product ? (
                                            <img
                                                src={product.image ? product.image.src : 'URL_DEFAULT_IMAGE'} // Thay thế 'URL_DEFAULT_IMAGE' bằng URL hình ảnh mặc định nếu không có hình ảnh
                                                alt={product.title || 'Product Image'}
                                                style={{ maxWidth: '100px', maxHeight: '100px' }} // Thay đổi kích thước hình ảnh tùy ý
                                            />
                                        ) : (
                                            'Product Not Found'
                                        )}
                                    </td>
                                    <td>
                                        {variant && (
                                            <>
                                                {variant.option1 && <span>{variant.option1}</span>}
                                                {variant.option2 && <span>{variant.option2}</span>}
                                                {variant.option3 && <span>{variant.option3}</span>}
                                                {!variant.option1 && !variant.option2 && !variant.option3 && <span>No Options</span>}
                                            </>
                                        )}
                                        {!variant && 'Variant Not Found'}
                                    </td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    };



    const fetchProductDetails = async (productId) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;
            const response = await axios.get(`http://localhost:8080/api/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setProductDetails((prevProductDetails) => [...prevProductDetails, response.data]);

        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };
    const totalOrderById = (orderId) => {
        let sum = 0;

        const order = orders.find(order => order.id === orderId);

        if (order) {
            order.line_items.forEach(item => {
                sum += item.price * item.quantity;
            });
        }

        return sum;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchOrders(pageNumber - 1);
    };

    const handleViewDetails = async (orderId) => {
        const order = orders.find(order => order.id === orderId);
        setSelectedOrder(order);
        await fetchProductDetails(orderId);

        setShowModal(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const totalOrderAmount = (order) => {
        let sum = 0;

        if (order) {
            order.line_items.forEach(item => {
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
            <h2>My Orders</h2>
            {/* Dropdown để lọc theo trạng thái */}
            <DropdownButton id="filter-dropdown" title={`Filter by Status: ${filterStatus}`}>
                <Dropdown.Item onClick={() => setFilterStatus("All")}>All</Dropdown.Item>
                {orderCounts.map((item, index) => (
                    <Dropdown.Item key={index} onClick={() => setFilterStatus(item.status)}>
                        {item.status} ({item.count})
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
                        {/* Thêm các cột khác tùy thuộc vào dữ liệu đơn hàng */}
                    </tr>
                </thead>
                <tbody>
                    {orders?.map(order => (
                        <tr key={order.id} style={{ backgroundColor: getOrderStatusColor(order.status) }}>
                            <td>{order.id}</td>
                            <td>{order.address.first_name + " " + order.address.last_name}</td>
                            <td>{totalOrderById(order.id)}</td>
                            <td>{order.created_time}</td>
                            <td>
                                <DropdownButton id={`dropdown-button-${order.id}`} title={order.status}>
                                    {order.status === "New" && (
                                        <>
                                            <Dropdown.Item onClick={() => changeOrderStatus(order.id, "Accept")}>Accept</Dropdown.Item>
                                            <Dropdown.Item onClick={() => changeOrderStatus(order.id, "Cancel")}>Cancel</Dropdown.Item>
                                        </>
                                    )}
                                    {order.status === "Accept" && (
                                        <>
                                            <Dropdown.Item onClick={() => changeOrderStatus(order.id, "Shipping")}>Shipping</Dropdown.Item>
                                            <Dropdown.Item onClick={() => changeOrderStatus(order.id, "Cancel")}>Cancel</Dropdown.Item>
                                        </>
                                    )}
                                    {order.status === "Shipping" && (
                                        <Dropdown.Item onClick={() => changeOrderStatus(order.id, "Done")}>Done</Dropdown.Item>
                                    )}
                                </DropdownButton>
                            </td>
                            {/* Thêm các cột khác tùy thuộc vào dữ liệu đơn hàng */}
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
                            <p>Total Amount: ${totalOrderAmount(selectedOrder)}</p>
                            <div>
                                {/* Hiển thị thông tin chi tiết của từng sản phẩm trong đơn hàng */}
                                {getOrderProduct(selectedOrder.id)}
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

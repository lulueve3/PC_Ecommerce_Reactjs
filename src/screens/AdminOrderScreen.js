import React, { useState, useEffect } from 'react';
import { Table, Pagination, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const AdminOrderScrren = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [productDetails, setProductDetails] = useState([]);


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
        } catch (error) {
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
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                        {/* Thêm các cột khác tùy thuộc vào dữ liệu đơn hàng */}
                    </tr>
                </thead>
                <tbody>
                    {orders?.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.address.first_name + " " + order.address.last_name}</td>
                            <td>{totalOrderById(order.id)}</td>
                            <td>
                                <Button variant="info" onClick={() => handleViewDetails(order.id)}>
                                    View Details
                                </Button>
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

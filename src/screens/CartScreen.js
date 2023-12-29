import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card, Pagination, Modal } from 'react-bootstrap'
import { addToCart, editCartItemQuantity } from '../action/cartAction'
import Message from '../components/Message'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import StripeContainer from '../components/StripeContainer'
import emailjs from '@emailjs/browser'


const ITEMS_PER_PAGE = 5; // Adjust as needed
const CartScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const qty = new URLSearchParams(location.search).get('qty') ? new URLSearchParams(location.search).get('qty') : 1;

    const dispatch = useDispatch();

    const [customerInfo, setCustomerInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: ""
    });

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleClosePaymentModal = () => setShowPaymentModal(false);
    const handleShowPaymentModal = () => setShowPaymentModal(true);


    const [userEmail, setUserEmail] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    const [selectedItems, setSelectedItems] = useState([]);
    const toggleSelectItem = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(itemId)) {
                return prevSelectedItems.filter((id) => id !== itemId);
            } else {
                return [...prevSelectedItems, itemId];
            }
        });
    };

    useEffect(() => {
        console.log(cartItems);
    }, [cartItems])

    const sendEmail = (orders) => {

        const templateParams = {
            name: "Tên khách hàng",
            email: "giotocdo@gmail.com",
            my_html: OrderConfirmationEmail(orders)
        };
        emailjs.send('service_6g2chws', 'template_928whlk', templateParams, 'PSjw63Ie2cQ9NAUsO');
    };


    useEffect(() => {
        if (id) {
            dispatch(addToCart(id, qty));
        }
    }, [dispatch, id, qty])

    const removeFromCartHandler = (id) => {
        dispatch(editCartItemQuantity(id, 0));
    }

    const editQuantityHandler = (id, newQty) => {
        dispatch(editCartItemQuantity(id, newQty));
    };


    const OrderConfirmationEmail = ({ line_items, customer, address }) => {
        const html = `
          <div>
            <h2>Order Confirmation</h2>
      
            <h3>Customer Information</h3>
            <p>
              <strong>Name:</strong> ${customer.first_name} ${customer.last_name}
            </p>
            <p>
              <strong>Email:</strong> ${customer.email}
            </p>
      
            <h3>Shipping Address</h3>
            <p>
              <strong>Address:</strong> ${address.address}
            </p>
            <p>
              <strong>Phone:</strong> ${address.phone}
            </p>
      
            <h3>Ordered Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th style="padding: 10px; text-align: left;">Image</th>
      <th style="padding: 10px; text-align: center;">Quantity</th>
      <th style="padding: 10px; text-align: center;">Price</th>
    </tr>
  </thead>
  <tbody>
    ${line_items
                .map(
                    (item) => `
          <tr key=${item.variant_id} style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; text-align: center;"><img src="${cartItems.find(cartItem => cartItem.id === item.variant_id)?.image}" alt="Product" style="max-width: 50px; max-height: 50px; border-radius: 5px;"></td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: center;">$${(cartItems.find(cartItem => cartItem.id === item.variant_id)?.price * item.quantity).toFixed(2)}</td>
          </tr>
        `
                )
                .join('')}
  </tbody>
</table>

      
<p style="font-size: 18px; color: green;">Total Order Amount: $${line_items
                .reduce((total, item) => total + cartItems.find(cartItem => cartItem.id === item.variant_id)?.price * item.quantity, 0)
                .toFixed(2)}</p>

  <p style="font-size: 16px; color: green;">Thank you for shopping with us!</p>
          </div>
        `;
        return html;
    };



    const createOrder = async () => {
        const line_items = selectedItems.map(itemId => {
            const item = cartItems.find(item => item.id === itemId);
            return {
                variant_id: itemId,
                quantity: item.qty
            };
        });
        const customer = {
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            email: userEmail ? userEmail : customerInfo.email
        }
        const address = {
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            address: customerInfo.address,
            phone: customerInfo.phone
        }
        const orders = {
            line_items,
            customer,
            address
        }
        try {


            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };


            const { data } = await axios.post('http://localhost:8080/api/orders', orders)

            const removeFunctions = selectedItems.map(itemId => () => removeFromCartHandler(itemId));

            // Gọi các hàm removeFunctions trong một lệnh
            removeFunctions.forEach(removeFunction => removeFunction());
            toast.success('Checkout success!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            sendEmail(orders)

            setSelectedItems([])


        } catch (error) {
            console.log(error);
            toast.error('Checkout faild!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const accessToken = localStorage.getItem('accessToken') || null;

    useEffect(() => {
        try {

            if (!accessToken) {

                return;
            }
            const decodedToken = jwtDecode(accessToken);
            setUserEmail(decodedToken.e);

            console.log(decodedToken);
        } catch (error) {
            console.error('Error decoding access token:', error);
        }

    }, [accessToken]);


    const checkoutHandler = () => {


        if (selectedItems.length < 1) {
            toast.warning('Please select product to checkout', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        }
        console.log(JSON.stringify(customerInfo));
        if (!customerInfo.firstName || !customerInfo.lastName || (!customerInfo.email && !userEmail) || !customerInfo.phone || !customerInfo.address) {
            toast.warning('Please fill in all customer information', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }


        handleShowPaymentModal();

    }

    const [currentPage, setCurrentPage] = useState(1);


    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentCartItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(cartItems.length / ITEMS_PER_PAGE); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    return (
        <>
            <ToastContainer />
            <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Include the StripeContainer component inside the modal body */}
                    <StripeContainer onSuccess={createOrder} amount={selectedItems?.reduce((acc, itemId) => acc + cartItems.find(item => item.id === itemId)?.qty * cartItems.find(item => item.id === itemId)?.price, 0).toFixed(3)} />
                </Modal.Body>
            </Modal>
            <Row>
                <Col md={9}>
                    <h1>Shopping Cart</h1>
                    {cartItems.length === 0 ? <Message>Your cart is empty <Link to="/">Go Back</Link> </Message> : (
                        <ListGroup variant='flush'>
                            {currentCartItems.map(item => (
                                <ListGroup.Item key={item.id}>
                                    <Row>
                                        {/* Column 1: Image */}
                                        <Col md={3}>
                                            <Link to={`/product/${item.productId}`}>
                                                <Image src={item.image} fluid rounded style={{ maxWidth: '150px', maxHeight: '150px' }} />
                                            </Link>
                                        </Col>

                                        {/* Column 2: Title */}
                                        <Col md={3}>
                                            <Link
                                                to={`/product/${item.id}`}
                                                style={{
                                                    display: 'block',
                                                    maxWidth: '100%',
                                                    wordWrap: 'break-word',
                                                    wordBreak: 'break-all'
                                                }}
                                            >
                                                {item.title}
                                            </Link>
                                        </Col>

                                        {/* Column 3: Price */}
                                        <Col md={2}>
                                            {item.price} $
                                        </Col>

                                        {/* Column 4: Quantity */}
                                        <Col md={2}>
                                            <input
                                                type="number"
                                                value={item.qty}
                                                min={1}
                                                max={item.inStock}
                                                onChange={(e) => {
                                                    const newValue = Math.min(Math.max(1, parseInt(e.target.value, 10)), item.inStock);
                                                    editQuantityHandler(item.id, newValue);
                                                }}
                                                className="form-control text-center"
                                                style={{ width: '100%' }}
                                            />
                                        </Col>

                                        {/* Column 5: Remove and Select */}
                                        <Col md={2}>
                                            <Button
                                                type='button'
                                                variant='light'
                                                onClick={() => removeFromCartHandler(item.id)}
                                                className='me-2'
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                            <input
                                                type='checkbox'
                                                id={item.id}
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                            />
                                        </Col>

                                        {/* Vertical Separator Column */}
                                        <Col md={1} className="separator-column"></Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            {pageNumbers.map(number => (
                                <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                                    {number}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>Subtotal ({selectedItems.length})</h3>
                                <h5>${selectedItems?.reduce((acc, itemId) => acc + cartItems.find(item => item.id === itemId)?.qty * cartItems.find(item => item.id === itemId)?.price, 0).toFixed(3)}</h5>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {/* Checkout button */}


                                {/* Customer information form */}
                                <Form className="mt-3">
                                    <Form.Group controlId="formName">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={customerInfo.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="lastName"
                                            value={customerInfo.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            value={userEmail ? userEmail : customerInfo.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPhone">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="phone"
                                            value={customerInfo.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formAddress">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={customerInfo.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                        Checkout
                                    </Button>

                                </Form>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

            </Row>
        </>

    )
}

export default CartScreen
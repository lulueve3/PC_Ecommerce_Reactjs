import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card, Pagination } from 'react-bootstrap'
import { addToCart, editCartItemQuantity } from '../action/cartAction'
import Message from '../components/Message'

const ITEMS_PER_PAGE = 5; // Adjust as needed
const CartScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const qty = new URLSearchParams(location.search).get('qty') ? new URLSearchParams(location.search).get('qty') : 1;

    const dispatch = useDispatch();

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


    const checkoutHandler = () => {
        navigate.push('/login?redirect=shipping')
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
        <Row>
            <Col md={9}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? <Message>Your cart is empty <Link to="/">Go Back</Link> </Message> : (
                    <ListGroup variant='flush'>
                        {currentCartItems.map(item => (
                            <ListGroup.Item key={item.id}>
                                <Row>
                                    <Col md={3}>
                                        <Link to={`/product/${item.id}`}><Image src={item.image} fluid rounded></Image>
                                        </Link>

                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                                    </Col>
                                    <Col md={2}>
                                        {item.price} $
                                    </Col>
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
                            <h5>${selectedItems.reduce((acc, itemId) => acc + cartItems.find(item => item.id === itemId).qty * cartItems.find(item => item.id === itemId).price, 0).toFixed(3)}</h5>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>Checkout</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
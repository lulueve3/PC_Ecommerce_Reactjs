import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addToCart } from '../action/cartAction'
import Message from '../components/Message'

const CartScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const qty = new URLSearchParams(location.search).get('qty') ? new URLSearchParams(location.search).get('qty') : 1;

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    useEffect(() => {
        if (id) {
            dispatch(addToCart(id, qty));
        }
    }, [dispatch, id, qty])

    const removeFromCartHandler = (id) => {

    }

    const checkoutHandler = () => {
        navigate.push('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? <Message>Your cart is empty <Link to="/">Go Back</Link> </Message> : (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => {
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} fluid rounded></Image>

                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        {item.price} VNĐ
                                    </Col>
                                    <Col md={2}>
                                        Điểu chỉnh số lượng
                                    </Col>
                                    <Col md={2}>
                                        <Button type='button' variant='Light' onClick={() => removeFromCartHandler(item.product)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</h2>
                            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(3)}
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
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addToCart, editCartItemQuantity } from '../action/cartAction'
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

    return (
        <Row>
            <Col md={9}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? <Message>Your cart is empty <Link to="/">Go Back</Link> </Message> : (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.id}>
                                <Row>
                                    <Col md={3}>
                                        <Image src={item.image} fluid rounded></Image>

                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                                    </Col>
                                    <Col md={2}>
                                        {item.price} $
                                    </Col>
                                    <Col md={3}>
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
                                    <Col md={1}>
                                        <Button type='button' variant='Light' onClick={() => removeFromCartHandler(item.id)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</h3>
                            <h5>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(3)}</h5>
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
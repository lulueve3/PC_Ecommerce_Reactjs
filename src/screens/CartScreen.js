import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addToCart } from '../action/cartAction'

const CartScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const qty = new URLSearchParams(location.search).get('qty');

    return (
        <div>
            {qty}
        </div>
    )
}

export default CartScreen
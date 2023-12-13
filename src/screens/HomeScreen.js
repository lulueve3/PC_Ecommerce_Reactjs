import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import productsTest from '../product'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts } from '../action/productActions'

const HomeScreen = () => {

    const { keyword } = useParams();


    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);

    const { loading, error, product } = productList;

    console.log(product);

    useEffect(() => {
        dispatch(listProducts(keyword))
    }, [dispatch])

    return (
        <>
            <h1>Lastest Products</h1>
            {
                loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                    <Row>
                        {product?.map(product => (
                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
            }

        </>
    )
}

export default HomeScreen
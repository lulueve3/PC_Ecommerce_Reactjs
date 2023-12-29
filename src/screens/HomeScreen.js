import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import productsTest from '../product'
import { Col, Row, Carousel } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts } from '../action/productActions'

const HomeScreen = () => {

    const { keyword, pageNumber } = useParams();


    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);

    const { loading, error, product, pages, page } = productList;

    console.log(product);

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber - 1))
    }, [dispatch, keyword, pageNumber])

    return (
        <>
            <Carousel className='custom-carousel-bg' interval={1500}>
                <Carousel.Item>
                    <Link to="/search/laptop">
                        <img
                            className="d-block w-100"
                            src={`${process.env.PUBLIC_URL}/laptop.jpg`}
                            alt="Laptop"
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </Link>
                </Carousel.Item>
                <Carousel.Item>
                    <Link to="/search/bàn phím">
                        <img
                            className="d-block w-100"
                            src={`${process.env.PUBLIC_URL}/banphim.png`}
                            alt="Laptop văn phòng"
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </Link>
                </Carousel.Item>
                <Carousel.Item>
                    <Link to="/search/chuột">
                        <img
                            className="d-block w-100"
                            src={`${process.env.PUBLIC_URL}/chuot.jpg`}
                            alt="Laptop văn phòng"
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </Link>
                </Carousel.Item>
                <Carousel.Item>
                    <Link to="/search/tai nghe">
                        <img
                            className="d-block w-100"
                            src={`${process.env.PUBLIC_URL}/tainghe.jpg`}
                            alt="Laptop văn phòng"
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </Link>
                </Carousel.Item>
            </Carousel>

            <h1>Lastest Products</h1>
            {
                loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                    <>
                        <Row>
                            {product?.map(product => (
                                <Col sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <div className='d-flex justify-content-center'>

                            <Paginate pages={pages} page={page + 1} keyword={keyword ? keyword : ''}></Paginate>
                        </div>
                    </>
            }

        </>
    )
}

export default HomeScreen
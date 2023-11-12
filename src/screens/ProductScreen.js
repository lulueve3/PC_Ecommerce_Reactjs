import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import products from '../product'
import { listProductDetail } from '../action/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const ProductScreen = ({ }) => {

    // Quan ly select button
    const [selectedButton, setSelectedButton] = useState(0);
    const handleButtonClick = (index) => {
        setSelectedButton(index);
        console.log(index);
    };

    const [qty, setQty] = useState(1);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //const product = products.find(p => p.id === (parseInt(id, 10)))

    const productDetails = useSelector(state => state.productDetail)
    const { loading, error, product } = productDetails;
    useEffect(() => {
        dispatch(listProductDetail(id));
    }, [dispatch, id])

    const addToCartHandler = () => {
        navigate.push(`/cart/${id}?qty=${1}`)
    }

    return (
        <>
            <Link className='btn btn-light my-3'>
                Go Back
            </Link>
            {
                loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                    product.images?.[0]?.src ? (
                        <Row>
                            <Col md={6}>
                                <Image
                                    src={product.images[0].src}
                                    alt={product.title}
                                    fluid
                                />
                            </Col>

                            <Col md={3}>
                                <ListGroup variant='flush'>
                                    <ListGroupItem>
                                        <h3>{product.title}</h3>

                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Rating value={4.5} text={`5`} color={'orange'} />
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        Price: ${product.variants[0].price}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Description: {product.description}
                                    </ListGroupItem>
                                </ListGroup>
                            </Col>
                            <Col md={3}>
                                <Card>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col> Price:</Col>
                                                <Col>
                                                    <strong>${product.variants[selectedButton].price}</strong>
                                                </Col>
                                            </Row>
                                            {
                                                product.variants.length < 2 ? <></> : product.variants.map((variant, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={selectedButton === index ? 'info' : 'light'}
                                                        type="button"
                                                        onClick={() => handleButtonClick(index, variant.price)}
                                                    >
                                                        {variant.option1 + ' ' + variant.option2} : {variant.price}
                                                    </Button>

                                                ))
                                            }
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col> Quantity:</Col>
                                                <Col>
                                                    <strong>{product.variants[selectedButton].quantity}</strong>
                                                </Col>
                                            </Row>
                                            {
                                                product.variants.length < 2 ? <></> : product.variants.map((variant, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={selectedButton === index ? 'info' : 'light'}
                                                        type="button"
                                                        onClick={() => handleButtonClick(index, variant.price)}
                                                    >
                                                        {variant.option1 + ' ' + variant.option2} : {variant.price}
                                                    </Button>

                                                ))
                                            }
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Button className='btn-blok' type='butoon' onClick={addToCartHandler}>
                                                Add To Cart
                                            </Button>
                                        </ListGroup.Item>

                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Message variant='info'>No images available</Message>
                    )
            }

        </>


    )
}

export default ProductScreen
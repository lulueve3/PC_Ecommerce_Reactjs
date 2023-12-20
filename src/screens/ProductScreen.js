import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import products from '../product'
import { listProductDetail } from '../action/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { addToCart, editCartItemQuantity } from '../action/cartAction'

const ProductScreen = ({ }) => {

    // Quan ly select button
    const [selectedButton, setSelectedButton] = useState(0);
    const handleButtonClick = (index, price) => {
        setSelectedButton(index);
        console.log(price);
        setPrice(price)
        setQty(1);
        console.log(index);
    };


    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);
    const [inStock, setInStock] = useState(1);
    const [image, setImage] = useState('/imgNotFound.png');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //const product = products.find(p => p.id === (parseInt(id, 10)))

    const productDetails = useSelector(state => state.productDetail)
    const { loading, error, product } = productDetails;
    useEffect(() => {
        dispatch(listProductDetail(id));
    }, [dispatch, id])

    useEffect(() => {
        if (product && product.variants) {
            setPrice(product.variants[0].price);
            setInStock(product.variants[0].quantity)
            // setImage(product.variants[0].image);
        }
    }, [product]);

    const addToCartHandler = () => {
        dispatch(addToCart({
            id: id,
            title: product.title,
            qty,
            price,
            image,
            inStock
        }));
    }


    return (
        <>
            <Link to='../' className='btn btn-light my-3'>
                Go Back
            </Link>
            {
                loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                    product?.title ? (
                        <Row>
                            <Col md={5}>
                                <Image
                                    src={product.images[0]?.src ? product.images[0]?.src : `${process.env.PUBLIC_URL}/imgNotFound.png`}
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
                            <Col md={4}>
                                <Card>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col> Price:</Col>
                                                <Col>
                                                    <strong>${product.variants[selectedButton].price}</strong>
                                                </Col>
                                            </Row>

                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col> Quantity:</Col>
                                                <Col>
                                                    <strong>{product.variants[selectedButton].quantity}</strong>
                                                </Col>
                                            </Row>
                                            {product.variants.length < 2 ? null : (
                                                <>

                                                    {product.variants.map((variant, index) => (
                                                        <Button
                                                            key={index}
                                                            variant={selectedButton === index ? 'info' : 'light'}
                                                            type="button"
                                                            onClick={() => handleButtonClick(index, variant.price)}
                                                        >
                                                            {variant.option1 + ' ' + variant.option2}
                                                        </Button>
                                                    ))}
                                                </>
                                            )}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            {product.variants[selectedButton].quantity <= 0 ? (
                                                <Button className='btn-block' type='button' disabled variant="danger">
                                                    Out Of Stock
                                                </Button>
                                            ) : (
                                                <>
                                                    <div className="d-flex mb-2 align-items-center">
                                                        <span className="mr-2">Enter Quantity:</span>
                                                        <div className="input-group">
                                                            <input
                                                                type="number"
                                                                value={qty}
                                                                min={1}
                                                                max={product.variants[selectedButton].quantity}
                                                                onChange={(e) => setQty(Math.min(parseInt(e.target.value), product.variants[selectedButton].quantity))}
                                                                className="form-control text-center"
                                                                style={{ width: '100%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button className='btn-block' type='button' onClick={addToCartHandler} variant="success">
                                                        Add To Cart
                                                    </Button>
                                                </>
                                            )}
                                        </ListGroup.Item>




                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Message variant='info'>No product available</Message>
                    )
            }

        </>


    )
}

export default ProductScreen
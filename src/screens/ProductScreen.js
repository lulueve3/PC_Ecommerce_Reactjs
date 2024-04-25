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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';


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

    const [selectedImage, setSelectedImage] = useState(0);

    const handlePrevClick = () => {
        setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
    };

    const handleNextClick = () => {
        setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
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

    const renderHTML = (htmlString) => {
        return { __html: htmlString };
    };

    useEffect(() => {
        if (product && product.variants) {
            setPrice(product.variants[0].price);
            setInStock(product.variants[0].quantity)
            // setImage(product.variants[0].image);
        }
    }, [product]);

    function concatenateOptions() {
        let { option1 = '', option2 = '', option3 = '' } = product.variants[selectedButton];
        if (option1 === null) option1 = "";
        if (option2 === null) option2 = "";
        if (option3 === null) option3 = "";
        return option1 + ' ' + option2 + ' ' + option3;
    }

    const addToCartHandler = () => {
        dispatch(addToCart({
            productId: product.id,
            id: product.variants[selectedButton].id,
            variant: concatenateOptions(),
            title: product.title,
            qty,
            price,
            image: product.image?.src ? product.image.src : `${process.env.PUBLIC_URL}/imgNotFound.png`,
            inStock: product.variants[selectedButton].quantity
        }));
        toast.success('Add to cart success!', {
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


    return (
        <>
            <ToastContainer />

            <Link to='../' className='btn btn-light my-3'>
                Go Back
            </Link>
            {
                loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                    product?.title ? (
                        <>
                            <Row>
                                <Col md={4}>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <Image
                                            src={product.images[selectedImage]?.src || `${process.env.PUBLIC_URL}/imgNotFound.png`}
                                            alt={product.title}
                                            fluid
                                            style={{ zIndex: 1, maxHeight: '300px' }} // Ensure that the main image is above the buttons
                                        />

                                        <Button
                                            className="gallery-nav-button"
                                            onClick={handlePrevClick}
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '10px',
                                                transform: 'translateY(-50%)',
                                                background: 'rgba(128, 128, 128, 0.5)', // Set the background color to gray
                                                color: 'white', // Set the text color to white
                                            }}
                                        >
                                            &lt;
                                        </Button>

                                        <Button
                                            className="gallery-nav-button"
                                            onClick={handleNextClick}
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '10px',
                                                transform: 'translateY(-50%)',
                                                background: 'rgba(128, 128, 128, 0.5)', // Set the background color to gray
                                                color: 'white', // Set the text color to white
                                            }}
                                        >
                                            &gt;
                                        </Button>

                                        <div className="thumbnails-container">
                                            {product.images.map((image, index) => (
                                                <div key={index} className="d-inline-block me-2">
                                                    <Image
                                                        src={image.src || `${process.env.PUBLIC_URL}/imgNotFound.png`}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        fluid
                                                        onClick={() => setSelectedImage(index)}
                                                        className={`thumbnail ${index === selectedImage ? 'selected-thumbnail' : ''}`}
                                                        style={{ width: '50px', height: '50px', margin: '5px' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Col>



                                <Col md={4}>
                                    <ListGroup variant='flush'>
                                        <ListGroupItem>
                                            <h3>{product.title}</h3>

                                        </ListGroupItem>


                                        <ListGroupItem>
                                            Price: ${product.variants[0].price}
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
                                                                {variant.option1 + ' ' + variant.option2 + " " + variant.option3}
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
                            <div style={{ marginTop: '50px' }}>
                                <h3>Description</h3>
                                <div dangerouslySetInnerHTML={renderHTML(product.description)} />
                            </div>


                        </>


                    ) : (
                        <Message variant='info'>No product available</Message>
                    )
            }

        </>


    )
}

export default ProductScreen
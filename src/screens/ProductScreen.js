import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import products from '../product'

const ProductScreen = ({ match }) => {
    const { id } = useParams();
    const product = products.find(p => p.id === (parseInt(id, 10)))

    return (
        <>
            <Link className='btn btn-light my-3'>
                Go Back
            </Link>

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
                                        <strong>${product.variants[0].price}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button className='btn-blok' type='butoon'>
                                    Add To Cart
                                </Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>


    )
}

export default ProductScreen
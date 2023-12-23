import React, { useEffect, useState } from 'react'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../action/userAction'
import FormContainer from '../components/FormContainer'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { deleteProduct, listProducts, createProduct, resetCreateProduct, listProductDetail } from '../action/productActions'
import { LinkContainer } from 'react-router-bootstrap'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../components/Paginate'

const ProductListScreen = () => {

    const { pageNumber } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productList = useSelector(state => state.productList)
    const { loading, error, product, pages, page } = productList;

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate
    useEffect(() => {
        // dispatch({ type: PRODUCT_CREATE_RESET })

        // if (successCreate) {
        //     navigate(`/admin/product/${createProduct.id}/edit`)
        // }
        // else {
        dispatch(listProducts('', pageNumber - 1))
        // }
    }, [dispatch, successDelete, successCreate, pageNumber, successUpdate])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
            dispatch(deleteProduct(id));
        }
    }

    const createProductHandler = () => {
        dispatch(resetCreateProduct())
        navigate('../admin/productList/create');
    }

    const handleEdit = (id) => {
        dispatch(listProductDetail(id));
        navigate(`../admin/productList/${id}/edit`);


    }

    return (
        <>
            <Row className='align-align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>IMAGE</th>
                                <th>TITLE</th>
                                <th>PRICE</th>
                                <th>ACTIVE</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {product?.map((product) => (
                                <tr>
                                    <td><Link to={`/product/${product.id}`}>{product.id}
                                    </Link></td>
                                    <td><Link to={`/product/${product.id}`}><Image src={product.images[0].src} fluid rounded style={{ maxWidth: '150px', maxHeight: '150px', margin: '5px' }} /></Link></td>
                                    <td>{product.title}</td>
                                    <td>{product.variants[0]?.price}</td>
                                    <td>{product.active ? 'true' : 'false'}</td>
                                    <td>
                                        <Button variant='light' className='btn-sm' onClick={() => handleEdit(product.id)}>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product.id)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page + 1} link='/admin/productList'></Paginate>

                </>
            )}

        </>

    )
}

export default ProductListScreen
import React, { useEffect, useState } from 'react'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../action/userAction'
import FormContainer from '../components/FormContainer'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { deleteProduct, listProducts, createProduct, resetCreateProduct } from '../action/productActions'
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


    useEffect(() => {
        // dispatch({ type: PRODUCT_CREATE_RESET })

        // if (successCreate) {
        //     navigate(`/admin/product/${createProduct.id}/edit`)
        // }
        // else {
        dispatch(listProducts('', pageNumber - 1))
        // }
    }, [dispatch, successDelete, successCreate, pageNumber])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
            dispatch(deleteProduct(id));
        }
    }

    const createProductHandler = () => {
        dispatch(resetCreateProduct())
        navigate('../admin/productList/create');
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
                                <th>TITLE</th>
                                <th>PRICE</th>
                                <th>ACTIVE</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {product?.map((product) => (
                                <tr>
                                    <td>{product.id}</td>
                                    <td>{product.title}</td>
                                    <td>{product.variants[0].price}</td>
                                    <td>{product.active ? 'true' : 'false'}</td>
                                    <td>
                                        <LinkContainer to={`${product.id}/edit`}>
                                            <Button variant='light' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
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
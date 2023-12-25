import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, } from 'react-redux'
import { Link, useParams, } from 'react-router-dom'

import productsTest from '../product'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts } from '../action/productActions'
import axios from 'axios';


const SearchScreen = () => {

    const { keyword, pageNumber } = useParams();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [collections, setCollections] = useState([]);




    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);

    const { loading, error, product, pages, page } = productList;

    console.log(product);

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber - 1, selectedCategory))
    }, [dispatch, keyword, pageNumber, selectedCategory])

    useEffect(() => {
        getCollections()
    }, [])

    const getCollections = async () => {
        try {

            const accessToken = localStorage.getItem('accessToken') || null;

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            const response = await axios.get('http://localhost:8080/api/collections', config);
            setCollections(response.data.results);
            console.log(response.data.results);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    return (
        <>
            <label>Filter by Category:</label>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >

                <option value=''>All</option>
                {collections.map(collection => (
                    <option value={collection.id}>{collection.title}</option>
                ))}
                {/* Thêm các option khác tùy thuộc vào danh sách category có thể xuất hiện */}
            </select>
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
                        <Paginate pages={pages} page={page + 1} keyword={keyword ? keyword : ''}></Paginate>
                    </>
            }

        </>
    )
}

export default SearchScreen
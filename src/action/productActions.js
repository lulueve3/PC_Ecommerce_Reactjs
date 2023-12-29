import { PRODUCT_CREATE_RESET, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_FAIL, PRODUCT_DELETE_FAIL, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_SUCCESS } from '../constants/productConstants'
import axios from 'axios'

export const listProducts = (keyword = '', page = '0', category = '') => async (dispatch) => {

    try {
        dispatch({ type: PRODUCT_LIST_REQUEST })

        if (category !== '') {
            const { data } = await axios.get(`http://localhost:8080/api/collections/${category}/products?page=${page ? page : 0}&size=8&keyword=${keyword}&sortDirection=DESC`)
            dispatch({
                type: PRODUCT_LIST_SUCCESS,
                payload: data
            })

        } else {
            const { data } = await axios.get(`http://localhost:8080/api/products?keyword=${keyword}&page=${page ? page : 0}&size=8&sortDirection=DESC`)
            dispatch({
                type: PRODUCT_LIST_SUCCESS,
                payload: data
            })

        }



    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}


export const listProductDetail = (id) => async (dispatch) => {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    try {

        const { data } = await axios.get(`http://localhost:8080/api/products/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
};


export const deleteProduct = (id) => async (dispatch) => {

    dispatch({ type: PRODUCT_DELETE_REQUEST });

    try {
        // Retrieve the access token from localStorage
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            // Handle the case where the access token is not available
            dispatch({
                type: PRODUCT_DELETE_FAIL,
                payload: 'Access token not found in localStorage'
            });
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        await axios.patch(`http://localhost:8080/api/admin/products/${id}`, {
            active: false
        }, config);

        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
};


export const createProduct = (product) => async (dispatch) => {

    dispatch({ type: PRODUCT_CREATE_REQUEST });

    try {
        // Retrieve the access token from localStorage
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            // Handle the case where the access token is not available
            dispatch({
                type: PRODUCT_CREATE_FAIL,
                payload: 'Access token not found in localStorage'
            });
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const { data } = await axios.post(`http://localhost:8080/api/admin/products`, { ...product }, config);

        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
};

export const updateProduct = (id, { title, description, vendor, active, variants, options, images, collectionIds }) => async (dispatch) => {

    dispatch({ type: PRODUCT_UPDATE_REQUEST });

    try {
        // Retrieve the access token from localStorage
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            // Handle the case where the access token is not available
            dispatch({
                type: PRODUCT_UPDATE_FAIL,
                payload: 'Access token not found in localStorage'
            });
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        for (const variant of variants) {
            const variantId = variant.id; // Assuming the variant object has an 'id' property

            const { updateVariant } = await axios.patch(`http://localhost:8080/api/admin/products/${id}/variants/${variantId}`, {
                price: variant.price,
                quantity: variant.quantity,
                position: variant.position,
                option1: variant.option1,
                option2: variant.option2,
                option3: variant.option3
            }, config);
        }

        const { data } = await axios.patch(`http://localhost:8080/api/admin/products/${id}`, {
            title,
            description,
            vendor,
            active,
            variants,
            options,
            images,
            collectionIds,
        }, config);

        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
};

export const resetCreateProduct = () => async (dispatch) => {
    dispatch({ type: PRODUCT_CREATE_RESET });
}


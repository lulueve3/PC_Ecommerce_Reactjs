import { PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS } from '../constants/productConstants'
import axios from 'axios'

export const listProducts = () => async (dispatch) => {

    try {
        dispatch({ type: PRODUCT_LIST_REQUEST })

        const { data } = await axios.get('http://localhost:8080/api/products')

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data.results
        })
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
        // Retrieve the access token from localStorage
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            // Handle the case where the access token is not available
            dispatch({
                type: PRODUCT_DETAILS_FAIL,
                payload: 'Access token not found in localStorage'
            });
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const { data } = await axios.get(`http://localhost:8080/api/admin/products/${id}`, config);

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



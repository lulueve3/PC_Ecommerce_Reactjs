import axios from 'axios'
import { CART_ADD_ITEM, CART_EDIT_QUANTITY, CART_REMOVE_ITEM } from '../constants/cartConstant'

export const addToCart = ({ id, title, qty, price, image, inStock }) => async (dispatch, getState) => {

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            id,
            title,
            image,
            qty,
            price,
            inStock
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const editCartItemQuantity = (id, newQty) => async (dispatch, getState) => {
    if (newQty === 0) {
        // Xóa mục hàng nếu newQty = 0
        dispatch({
            type: CART_REMOVE_ITEM,
            payload: {
                id,
            },
        });
    } else {
        // Cập nhật số lượng mục hàng
        dispatch({
            type: CART_EDIT_QUANTITY,
            payload: {
                id,
                qty: newQty,
            },
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
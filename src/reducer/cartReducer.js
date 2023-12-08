import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_EDIT_QUANTITY } from '../constants/cartConstant'

export const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const newItem = action.payload;
            const existingItem = state.cartItems.find(x => x.id === newItem.id);

            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x => (x.id === existingItem.id ? newItem : x))
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, newItem]
                };
            }
        case CART_EDIT_QUANTITY:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id ? { ...item, qty: action.payload.qty } : item
                ),
            };
        case CART_REMOVE_ITEM:
            const itemId = action.payload.id;
            return {
                ...state,
                cartItems: state.cartItems.filter((item) => item.id !== itemId),
            };

        default:
            return state
    }
}
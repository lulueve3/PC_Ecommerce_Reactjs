import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from "redux-thunk"
import { composeWithDevTools } from 'redux-devtools-extension'
import { productReducer, productDetailReducer, productDeleteReducer, productCreateReducer } from './reducer/productReducers'
import { cartReducer } from './reducer/cartReducer'
import { userLoginReducer, userListReducer } from './reducer/userReducer'

const reducer = combineReducers({
    productList: productReducer,
    productDetail: productDetailReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userList: userListReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []

const accessTokenFromStorage = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : []


const initialState = {
    cart: { cartItems: cartItemsFromStorage },
    userLogin: accessTokenFromStorage
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;
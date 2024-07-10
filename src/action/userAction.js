import axios from "axios"
import { USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT } from "../constants/userConstants copy"

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/auth/authenticate', { email, password }, config)

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data.accessToken
        })

        localStorage.setItem('accessToken', (data.accessToken))
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('accessToken')
    dispatch({ type: USER_LOGOUT })
}

export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST
        })

        const accessToken = localStorage.getItem('accessToken') || null;


        const config = {
            header: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            }
        }

        const { data } = await axios.post('http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/users', config)

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

import React, { useEffect, useState } from 'react'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../action/userAction'
import FormContainer from '../components/FormContainer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { listUsers } from '../action/userAction'
import { LinkContainer } from 'react-router-bootstrap'

const UserListScreen = () => {
    const dispatch = useDispatch();

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    useEffect(() => {
        dispatch(listUsers())
    }, [dispatch])

    const deleteHandler = (id) => {
        console.log('delete');
    }

    return (
        <>
            <h1>Users</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>PHONE</th>
                            <th>ROLE</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>hải</td>
                            <td>giotocdo@gmail.com</td>
                            <td>098721312</td>
                            <td>Admin</td>
                            <td>
                                <LinkContainer to={`http://localhost:8080/api/users/${1}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(1)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            )}

        </>

    )
}

export default UserListScreen
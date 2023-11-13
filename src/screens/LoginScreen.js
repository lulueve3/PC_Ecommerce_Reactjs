import React, { useEffect, useState } from 'react'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../action/userAction'
import FormContainer from '../components/FormContainer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'


const LoginScreen = ({ handleLoginLogout }) => {

    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { loading, error } = userLogin;
    const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null


    const location = useLocation();
    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (accessToken) {
            navigate(redirect)
        }
    }, [navigate, accessToken, redirect])

    const submitHandler = async (e) => {
        e.preventDefault()

        if (isRegistering) {
            if (password.length < 6) {
                alert('Mật khẩu ít nhất 6 ký tự');
            } else {

                try {
                    const config = {
                        header: {
                            'Content-Type': 'application/json'
                        }
                    }

                    const { data } = await axios.post('http://localhost:8080/api/auth/register', { email, password, firstName, lastName, phone }, config)

                    localStorage.setItem('accessToken', (data.accessToken))
                    handleLoginLogout(true);

                } catch (error) {
                    console.log(error);
                    alert(error.response.data.message);
                }
            }

        } else {
            // Handle login here with email and password
            dispatch(login(email, password));
            handleLoginLogout(true);
        }
    }


    return (
        <FormContainer>
            <h1>{isRegistering ? 'Register' : 'Sign In'}</h1>
            {error && <Message variant='danger'>Đăng nhập thất bại</Message>}
            {loading && <Loader></Loader>}
            <Form onSubmit={submitHandler}>
                {isRegistering && (
                    <>
                        <Form.Group controlId='firstName'>
                            <Form.Label>Họ</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Nhập Họ (Không bắt buộc)'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='lastName'>
                            <Form.Label>Tên</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Nhập Tên (Không bắt buộc)'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='phone'>
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Nhập SĐT (Không bắt buộc)'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </Form.Group>
                    </>
                )}
                <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Nhập email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Nhập mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type='submit' variant='primary'>
                    {isRegistering ? 'Register' : 'Sign In'}
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    {isRegistering
                        ? 'Already have an account?'
                        : 'New Customer?'}
                    <Link onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? 'Sign In' : 'Register'}
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
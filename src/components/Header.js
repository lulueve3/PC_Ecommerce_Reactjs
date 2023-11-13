import React, { useEffect, useState } from 'react'
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../action/userAction';

const Header = ({ handleLoginLogout, isLoggedIn }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);


    const dispatch = useDispatch();
    const logoutHandler = () => {
        dispatch(logout());
        handleLoginLogout();
    }

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken);
        console.log("access " + storedAccessToken);
    }, [isLoggedIn]);

    return (
        <header>
            <Navbar expand="lg" collapseOnSelect variant='dark' bg='dark' >
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>HH Computer</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <LinkContainer to='/cart'>
                                <Nav.Link ><i className='fas fa fa-shopping-cart'></i> Giỏ Hàng</Nav.Link>
                            </LinkContainer>
                            {!isLoggedIn ? (
                                <NavDropdown title='userName' id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Đăng xuất</NavDropdown.Item>
                                </NavDropdown>
                            ) :
                                <LinkContainer to='/login'>
                                    <Nav.Link ><i class="fa-solid fa-user"></i> Đăng Nhập</Nav.Link>

                                </LinkContainer>

                            }


                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
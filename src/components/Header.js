import React, { useEffect, useState } from 'react'
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../action/userAction';
import SearchBox from '../components/SearchBox';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'


const Header = ({ handleLoginLogout, isLoggedIn }) => {
    const [user, setUser] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);



    const setUserInfor = (accessToken) => {
        try {
            if (!accessToken) {
                setIsAdmin(false);
                return;
            }


            const decodedToken = jwtDecode(accessToken);
            console.log(decodedToken);
            setUser(prevUser => {
                if (prevUser && prevUser.a && prevUser.a[0] === "ROLE_ADMIN") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
                return decodedToken;
            });


        } catch (error) {
            console.error('Error decoding access token:', error);
            navigate('/login');
        }
    }



    const dispatch = useDispatch();
    const logoutHandler = () => {
        dispatch(logout());
        handleLoginLogout(false);
        setUser([]);
        setIsAdmin(false);
        navigate('/');
    }

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken);
        setUserInfor(storedAccessToken);
    }, [isLoggedIn, accessToken]);



    return (
        <header>
            <Navbar expand="lg" collapseOnSelect variant='dark' bg='dark' >
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>HH Computer</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <SearchBox />
                        </Nav>
                        <Nav className="ml-auto">
                            <LinkContainer to='/cart'>
                                <Nav.Link ><i className='fas fa fa-shopping-cart'></i> Giỏ Hàng</Nav.Link>
                            </LinkContainer>
                            {isLoggedIn ? (
                                <NavDropdown title={user.e} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/products'>
                                        <NavDropdown.Item>My Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Đăng xuất</NavDropdown.Item>
                                </NavDropdown>
                            ) :
                                <LinkContainer to='/login'>
                                    <Nav.Link ><i class="fa-solid fa-user"></i> Đăng Nhập</Nav.Link>

                                </LinkContainer>

                            }
                            {isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <LinkContainer to='/admin/userList'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/productList'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/collection'>
                                        <NavDropdown.Item>Collection</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/orderList'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}


                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
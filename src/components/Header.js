import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
    return (
        <header>
            <Navbar expand="lg" collapseOnSelect variant='dark' bg='dark' >
                <Container>
                    <Navbar.Brand href="/">HH Computer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/cart"><i className='fas fa fa-shopping-cart'></i> Giỏ Hàng</Nav.Link>
                            <Nav.Link href="#/login"><i class="fa-solid fa-user"></i> Đăng Nhập</Nav.Link>

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
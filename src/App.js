import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Routes, Route } from "react-router-dom";
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import { useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập ban đầu

  const handleLoginLogout = (state) => {
    console.log("log " + isLoggedIn);
    setIsLoggedIn(state)

  }
  return (
    <>
      <Header handleLoginLogout={handleLoginLogout} isLoggedIn={isLoggedIn} />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/login" element={<LoginScreen handleLoginLogout={handleLoginLogout} />} />
            <Route path="/cart/:id?" element={<CartScreen />} />

          </Routes>
        </Container>
      </main>

      <Footer />
    </>
  );
}
export default App;

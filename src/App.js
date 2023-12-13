import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Routes, Route } from "react-router-dom";
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import { useEffect, useState } from 'react';
import UserListScreen from './screens/UserListScreen';
import ProductListScreen from './screens/ProductList';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductCreateScreen from './screens/ProductCreateScreen';
import SearchBox from './components/SearchBox';
import UserProfile from './screens/UserProfile';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập ban đầu

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken') || null;
    if (storedAccessToken)
      setIsLoggedIn(true)
  }, []);

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
            <Route path='/search/:keyword' element={<SearchBox />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/login" element={<LoginScreen handleLoginLogout={handleLoginLogout} />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/admin/userList" element={<UserListScreen />} />
            <Route path="/admin/productList" element={<ProductListScreen />} />
            <Route path="/admin/productList/:id/edit" element={<ProductEditScreen />} />
            <Route path="/admin/productList/create" element={<ProductCreateScreen />} />
          </Routes>
        </Container>
      </main>

      <Footer />
    </>
  );
}
export default App;

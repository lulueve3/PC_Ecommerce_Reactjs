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
import PrivateRoute from './components/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux'




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập ban đầu

  const user = useSelector(state => state.userLogin)
  const { loading, error, accessToken } = user;
  useEffect(() => {

    const storedAccessToken = localStorage.getItem('accessToken') || null;
    if (storedAccessToken)
      setIsLoggedIn(true)
    else
      setIsLoggedIn(false)
  }, [accessToken]);



  const handleLoginLogout = (state) => {
    if (accessToken)
      setIsLoggedIn(true)
    else
      setIsLoggedIn(false)

  }
  return (
    <>
      <Header handleLoginLogout={handleLoginLogout} isLoggedIn={isLoggedIn} />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} />

            <Route path='/profile' element={<UserProfile />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/login" element={<LoginScreen handleLoginLogout={handleLoginLogout} />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/admin/userList" element={<UserListScreen />} />
            <Route path="/admin/productList" element={<PrivateRoute><ProductListScreen /></PrivateRoute>} />
            <Route path="/admin/productList/:id/edit" element={<ProductEditScreen />} />
            <Route path="/admin/productList/create" element={<ProductCreateScreen />} />
            <Route path='/search/:keyword' element={<HomeScreen />} />
            <Route path='/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/admin/productList/page/:pageNumber' element={<ProductListScreen />} />
            <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
          </Routes>
        </Container>
      </main>

      <Footer />
    </>
  );
}
export default App;

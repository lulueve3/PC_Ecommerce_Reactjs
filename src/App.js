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
import CollectionScreen from './screens/CollectionScreen'
import DashboardScreen from './screens/DashboardScreen'
import MyOrders from './screens/MyOrders';
import SearchScreen from './screens/SearchScreen';
import AdminOrderScrren from './screens/AdminOrderScreen';
import AdminUserOrder from './screens/AdminUserOrder'
import BuildPcScreen from './screens/BuildPcScreen';
import QnAPScreen from './screens/QnAScreen';
import PostDetail from './screens/PostDetailScreen';
import AppScreen from './screens/AppScreen';
import ExchangePage from './screens/ExchangeScreen';
import TaskPage from './components/TaskPage';
import RedeemPage from './components/RedeemPage';





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
            <Route path='/MyOrders' element={<MyOrders />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/login" element={<LoginScreen handleLoginLogout={handleLoginLogout} />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/buid-pc" element={<BuildPcScreen />} />
            <Route path="/QnA" element={<QnAPScreen />} />
            <Route path="/App" element={<AppScreen />} />
            <Route path="/Exchange" element={<ExchangePage />} />
            <Route path="/exchange/tasks" element={<TaskPage />} />
            <Route path="/exchange/redeem" element={<RedeemPage />} />

            <Route path="/PostDetail" element={<PostDetail />} />
            <Route path="/admin/userList" element={<UserListScreen />} />
            <Route path="/admin/userList/:id" element={<AdminUserOrder />} />

            <Route path="/admin/productList" element={<PrivateRoute><ProductListScreen /></PrivateRoute>} />
            <Route path="/admin/orderList" element={<PrivateRoute><AdminOrderScrren /></PrivateRoute>} />
            <Route path="/admin/Dashboard" element={<PrivateRoute><DashboardScreen /></PrivateRoute>} />
            <Route path="/admin/collection" element={<PrivateRoute><CollectionScreen /></PrivateRoute>} />
            <Route path="/admin/productList/:id/edit" element={<PrivateRoute><ProductEditScreen /></PrivateRoute>} />
            <Route path="/admin/productList/create" element={<PrivateRoute><ProductCreateScreen /></PrivateRoute>} />
            <Route path='/search/:keyword' element={<SearchScreen />} />
            <Route path='/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/admin/productList/page/:pageNumber' element={<PrivateRoute><ProductListScreen /></PrivateRoute>} />
            <Route path='/search/:keyword/page/:pageNumber/collection/:idCollect' element={<SearchScreen />} />
            <Route path='/search/:keyword/page/:pageNumber' element={<SearchScreen />} />
            <Route path='/search' element={<SearchScreen />} />

          </Routes>
        </Container>
      </main>

      <Footer />

    </>
  );
}
export default App;

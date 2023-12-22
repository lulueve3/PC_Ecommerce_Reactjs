import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


import { Route, Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {

    const [userRole, setUserRole] = useState("ROLE_USER");

    const navigate = useNavigate();



    useEffect(() => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                // Handle the case where the access token is not available
                navigate('/');
                return;
            }
            // Giải mã token sử dụng thư viện jwt-decode
            const decodedToken = jwtDecode(accessToken);
            setUserRole(decodedToken.a[0]);
            console.log(userRole)
            console.log(userRole !== 'ROLE_ADMIN');

        } catch (error) {
            console.error('Error decoding access token:', error);
        }
    }, []);


    if (userRole !== 'ROLE_ADMIN') {
        return <Navigate to='/' />

    }
    return children;

};

export default PrivateRoute;

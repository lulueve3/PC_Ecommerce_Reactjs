import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from 'react-bootstrap';



import { Route, Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);



    const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        try {

            if (!accessToken) {
                navigate('/');
                return;
            }
            const decodedToken = jwtDecode(accessToken);
            const newUserRole = decodedToken.a[0];

            if (newUserRole !== 'ROLE_ADMIN') {
                navigate('/');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error decoding access token:', error);
        }

    }, [accessToken]);

    if (loading) {
        // Display a React Bootstrap loading spinner
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return children;

};

export default PrivateRoute;

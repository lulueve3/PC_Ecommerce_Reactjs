// ChangePasswordForm.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'

const ChangePasswordForm = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate and handle password change
        if (newPassword === confirmPassword) {
            apiChangePassword()
            // Reset form after successful password change

        } else {
            toast.error('The password and password confirmation do not mismatch', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const apiChangePassword = async () => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            toast.error('Please login again', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const data = {
            oldPassword: password,
            newPassword: newPassword
        }

        try {
            const response = await axios.patch(`http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer/password`, data, config);

            if (response.status === 200) {
                // Change password success
                toast.success('Password changed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Change password failed (use the message from the API response)
                toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            // Handle other errors (e.g., network issues)
            toast.error('Change password fail. Please try again later.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }


    }

    return (
        <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group controlId="password">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
            </Form.Group>

            <Form.Group controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                />
            </Form.Group>

            <Form.Group controlId="showPasswordCheckbox">
                <Form.Check
                    type="checkbox"
                    label="Show Password"
                    onChange={() => setShowPassword(!showPassword)}
                />
            </Form.Group>

            <Button type="submit" variant="primary">
                Change Password
            </Button>
        </Form>
    );
};

export default ChangePasswordForm;

// ChangePasswordForm.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ChangePasswordForm = ({ onChangePassword }) => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate and handle password change
        if (newPassword === confirmPassword) {
            onChangePassword(newPassword);
            // Reset form after successful password change
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            alert('New password and confirm password must match.');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group controlId="password">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Button type="submit" variant="primary">
                Change Password
            </Button>
        </Form>
    );
};

export default ChangePasswordForm;

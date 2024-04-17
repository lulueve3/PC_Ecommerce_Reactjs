import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import DiscountModal from '../components/DiscountModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const DiscountManager = () => {
    const [showModal, setShowModal] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [currentDiscount, setCurrentDiscount] = useState(null);
    const [isNew, setIsNew] = useState(true);

    const fetchDiscounts = async () => {
        const accessToken = localStorage.getItem('accessToken') || null;
        try {
            const response = await axios.get('http://localhost:8080/api/admin/price_rules', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setDiscounts(response.data || []);
        } catch (error) {
            console.error('Error fetching discounts:', error);
            toast.error('Error fetching discounts. Please try again.');
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleShowModal = (discount) => {
        setCurrentDiscount(discount || {
            // New discount default values
            title: '',
            usageLimit: 0,
            value: 0,
            valueType: 'PERCENTAGE',
            maxDiscountValue: 0,
            prerequisiteQuantityRange: 0,
            prerequisiteSubtotalRange: 0,
            prerequisiteCustomerIds: [],
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString()
        });
        setIsNew(!discount);
        setShowModal(true);
    };

    const handleEdit = (discount) => {
        handleShowModal(discount);
    };

    const handleDelete = async (id) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || null;
            await axios.delete(`http://localhost:8080/api/admin/price_rules/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setDiscounts(discounts.filter(discount => discount.id !== id));
            toast.success('Discount deleted successfully!');
        } catch (error) {
            console.error('Error deleting the discount:', error);
            toast.error('Error deleting discount. Please try again.');
        }
    };

    const renderDiscountsTable = () => (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Value</th>
                    <th>Value Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {discounts.map((discount) => (
                    <tr key={discount.id}>
                        <td>{discount.title}</td>
                        <td>{discount.value}</td>
                        <td>{discount.valueType}</td>
                        <td>
                            <Button variant="info" onClick={() => handleEdit(discount)}>
                                Edit
                            </Button>{' '}
                            <Button variant="danger" onClick={() => handleDelete(discount.id)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    return (
        <>
            <Button variant="primary" onClick={() => handleShowModal(null)}>
                Add Discount
            </Button>
            {renderDiscountsTable()}
            <DiscountModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                discount={currentDiscount}
                setDiscount={setCurrentDiscount}
                handleSubmit={() => { }} // Implement submission logic here
                isNew={isNew}
            />
        </>
    );
};

export default DiscountManager;
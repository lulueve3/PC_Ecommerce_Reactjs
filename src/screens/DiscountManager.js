import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import DiscountModal from '../components/DiscountModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const DiscountManager = () => {
    const [showModal, setShowModal] = useState(false);
    const [discounts, setDiscounts] = useState([
        // Sample discounts
        {
            id: 1,
            title: 'Spring Sale',
            usageLimit: 100,
            value: 20,
            valueType: 'PERCENTAGE',
            maxDiscountValue: 50,
            prerequisiteQuantityRange: 1,
            prerequisiteSubtotalRange: 50,
            prerequisiteCustomerIds: [101, 102],
            startTime: '2024-04-01T00:00:00Z',
            endTime: '2024-04-30T23:59:59Z'
        },
        {
            "id": 1,
            "title": "Spring Sale",
            "usageLimit": 100,
            "value": 20,
            "valueType": "PERCENTAGE",
            "maxDiscountValue": 50,
            "prerequisiteQuantityRange": 1,
            "prerequisiteSubtotalRange": 50,
            "prerequisiteCustomerIds": [101, 102],
            "startTime": "2024-04-01T00:00:00Z",
            "endTime": "2024-04-30T23:59:59Z"
        },
        {
            "id": 2,
            "title": "Summer Sale",
            "usageLimit": 200,
            "value": 15,
            "valueType": "PERCENTAGE",
            "maxDiscountValue": 30,
            "prerequisiteQuantityRange": 2,
            "prerequisiteSubtotalRange": 100,
            "prerequisiteCustomerIds": [103, 104],
            "startTime": "2024-06-01T00:00:00Z",
            "endTime": "2024-06-30T23:59:59Z"
        },
        {
            "id": 3,
            "title": "Weekend Sale",
            "usageLimit": 50,
            "value": 10,
            "valueType": "PERCENTAGE",
            "maxDiscountValue": 20,
            "prerequisiteQuantityRange": 1,
            "prerequisiteSubtotalRange": 50,
            "prerequisiteCustomerIds": [105, 106, 107],
            "startTime": "2024-04-15T00:00:00Z",
            "endTime": "2024-04-17T23:59:59Z"
        },
        {
            "id": 4,
            "title": "Birthday Sale",
            "usageLimit": 1,
            "value": 100,
            "valueType": "PERCENTAGE",
            "maxDiscountValue": 100,
            "prerequisiteQuantityRange": 1,
            "prerequisiteSubtotalRange": 0,
            "prerequisiteCustomerIds": [108],
            "startTime": "2024-05-10T00:00:00Z",
            "endTime": "2024-05-10T23:59:59Z"
        }
        // ... more sample discounts
    ]);
    const [currentDiscount, setCurrentDiscount] = useState(null);
    const [isNew, setIsNew] = useState(true);

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
            await axios.delete(`http://localhost:8080/api/admin/price_rules/${id}`);
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
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';


const DiscountModal = ({ show, handleClose, discount, setDiscount, isNew }) => {
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDiscount({ ...discount, [name]: value });
    };

    const handleSubmit = async () => {
        // Prepare your discount data here, ensure proper formatting
        // Especially for prerequisiteCustomerIds, startTime, and endTime
        const discountData = {
            ...discount,
            prerequisiteCustomerIds: [0]
        };
        const accessToken = localStorage.getItem('accessToken') || null;


        try {
            const response = isNew
                ? await axios.post('http://localhost:8080/api/admin/price_rules', discountData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                : await axios.put(`http://localhost:8080/api/admin/price_rules/${discount.id}`, discountData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

            handleClose();
            toast.success('Discount saved successfully!');
        } catch (error) {
            console.error('There was an error saving the discount:', error);
            toast.error('Error saving discount. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isNew ? 'Add Discount' : 'Edit Discount'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="discountTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={discount?.title}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="discountUsageLimit">
                        <Form.Label>Usage Limit</Form.Label>
                        <Form.Control
                            type="number"
                            name="usageLimit"
                            value={discount?.usageLimit}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="discountValue">
                        <Form.Label>Discount Value</Form.Label>
                        <Form.Control
                            type="number"
                            name="value"
                            value={discount?.value}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="discountValueType">
                        <Form.Label>Value Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="valueType"
                            value={discount?.valueType}
                            onChange={handleInputChange}
                        >
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="FIXED_AMOUNT">Fixed Amount</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="discountMaxDiscountValue">
                        <Form.Label>Max Discount Value</Form.Label>
                        <Form.Control
                            type="number"
                            name="maxDiscountValue"
                            value={discount?.maxDiscountValue}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="discountPrerequisiteQuantityRange">
                        <Form.Label>Prerequisite Quantity Range</Form.Label>
                        <Form.Control
                            type="number"
                            name="prerequisiteQuantityRange"
                            value={discount?.prerequisiteQuantityRange}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="discountPrerequisiteSubtotalRange">
                        <Form.Label>Prerequisite Subtotal Range</Form.Label>
                        <Form.Control
                            type="number"
                            name="prerequisiteSubtotalRange"
                            value={discount?.prerequisiteSubtotalRange}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </Form.Group>

                    {/* Assuming prerequisiteCustomerIds is an array of integers */}
                    {/* <Form.Group controlId="discountPrerequisiteCustomerIds">
                        <Form.Label>Prerequisite Customer IDs</Form.Label>
                        <Form.Control
                            type="text"
                            name="prerequisiteCustomerIds"
                            value={discount?.prerequisiteCustomerIds.join(',')}
                            onChange={(e) => handleInputChange({
                                target: {
                                    name: e.target.name,
                                    value: e.target.value.split(',').map(id => parseInt(id, 10)),
                                },
                            })}
                            placeholder="Enter IDs separated by commas"
                        />
                    </Form.Group> */}

                    <Form.Group controlId="discountStartTime">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="startTime"
                            value={discount?.startTime}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="discountEndTime">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="endTime"
                            value={discount?.endTime}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DiscountModal;
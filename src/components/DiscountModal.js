import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';


const DiscountModal = ({ show, handleClose, discount, setDiscount, isNew, onSubmitSuccess }) => {
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // If the input is for 'value' or 'maxDiscountValue', store it as a negative value
        if ((name === 'value' || name === 'maxDiscountValue') && value) {
            setDiscount({ ...discount, [name]: -Math.abs(value) });
        } else {
            setDiscount({ ...discount, [name]: value });
        }
    };

    const handleSubmit = async () => {
        // Prepare your discount data here, ensure proper formatting
        // Especially for prerequisiteCustomerIds, startTime, and endTime
        const discountData = {
            ...discount,
            // Convert 'value' and 'maxDiscountValue' to negative before sending to the server
            value: discount.value ? -Math.abs(discount.value) : discount.value,
            maxDiscountValue: discount.maxDiscountValue ? -Math.abs(discount.maxDiscountValue) : discount.maxDiscountValue,
            startTime: discount.startTime ? new Date(discount.startTime).toISOString() : undefined,
            endTime: discount.endTime ? new Date(discount.endTime).toISOString() : undefined
        };

        const accessToken = localStorage.getItem('accessToken') || null;

        try {
            const response = isNew
                ? await axios.post('http://localhost:8080/api/admin/price_rules', discountData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                : await axios.post(`http://localhost:8080/api/admin/price_rules/${discount.id}`, discountData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

            handleClose();
            toast.success('Discount saved successfully!');
            onSubmitSuccess()
        } catch (error) {
            console.error('There was an error saving the discount:', error);
            toast.error(error.response.data?.message);
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
                            readOnly={!isNew}
                        />
                    </Form.Group>

                    <Form.Group controlId="discountUsageLimit">
                        <Form.Label>Usage Limit</Form.Label>
                        <Form.Control
                            type="number"
                            name="usageLimit"
                            value={discount?.usageLimit}
                            onChange={handleInputChange}
                            min="1"
                        />
                    </Form.Group>

                    <Form.Group controlId="discountValue">
                        <Form.Label>Discount Value</Form.Label>
                        <Form.Control
                            type="number"
                            name="value"
                            value={Math.abs(discount?.value || 0)} // Convert to positive for display
                            onChange={handleInputChange}
                            min="1"
                            readOnly={!isNew}

                        />
                    </Form.Group>

                    <Form.Group controlId="discountValueType">
                        <Form.Label>Value Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="valueType"
                            value={discount?.valueType}
                            onChange={handleInputChange}
                            disabled={!isNew}

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
                            value={Math.abs(discount?.maxDiscountValue || 0)} // Convert to positive for display
                            onChange={handleInputChange}
                            min="1"
                            readOnly={!isNew}

                        />
                    </Form.Group>

                    <Form.Group controlId="discountPrerequisiteQuantityRange">
                        <Form.Label>Prerequisite Quantity Range</Form.Label>
                        <Form.Control
                            type="number"
                            name="prerequisiteQuantityRange"
                            value={discount?.prerequisiteQuantityRange}
                            onChange={handleInputChange}
                            min="1"
                            readOnly={!isNew}

                        />
                    </Form.Group>

                    <Form.Group controlId="discountPrerequisiteSubtotalRange">
                        <Form.Label>Prerequisite Subtotal Range</Form.Label>
                        <Form.Control
                            type="number"
                            name="prerequisiteSubtotalRange"
                            value={discount?.prerequisiteSubtotalRange}
                            onChange={handleInputChange}
                            min="1"
                            readOnly={!isNew}

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
                            readOnly={!isNew}

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
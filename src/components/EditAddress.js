// UserProfile.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import ChangePasswordForm from '../components/ChangePasswordForm';
import axios from 'axios';

const EditAddress = ({ address, handleAddAddress, handleEditAddress, onCancel, onSave }) => {
    const [editedAddress, setEditedAddress] = useState({ ...address });
    const [selectedCity, setSelectedCity] = useState(editedAddress.city || 0);
    const [selectedDistrict, setSelectedDistrict] = useState(editedAddress.district || 0);
    const [selectedWard, setSelectedWard] = useState(editedAddress.ward || 0);
    const [addressName, setAddressName] = useState("");


    // handle call api address
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);



    const host = "https://provinces.open-api.vn/api/";

    const callAPI = async (api, callback) => {
        try {
            const response = await axios.get(api);
            callback(response.data);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    useEffect(() => {


        callAPI(`${host}?depth=1`, setCities);
    }, []);

    const handleCityChange = (event, index) => {
        const cityCode = event.target.value;
        callApiDistrict(`${host}p/${cityCode}?depth=2`, (data) => {
            // const updatedAddresses = [...editedAddresses];
            // updatedAddresses[index].districts = data.districts;
            // updatedAddresses[index].city = cityCode;
            // setEditedAddresses(updatedAddresses);
        });

    };

    const handleDistrictChange = (event, index) => {
        const districtCode = event.target.value;
        callApiWard(`${host}d/${districtCode}?depth=2`, (data) => {
            // const updatedAddresses = [...editedAddresses];
            // updatedAddresses[index].wards = data.wards;
            // updatedAddresses[index].district = districtCode;
            // setEditedAddresses(updatedAddresses);
        });
    };

    const handleWardChange = (event, index) => {
        const wardCode = event.target.value;
        // const updatedAddresses = [...editedAddresses];
        // updatedAddresses[index].ward = wardCode;
        // setEditedAddresses(updatedAddresses);
    };

    const callApiWard = (api, callback) => {
        callAPI(api, (data) => {
            setWards(data.wards);
        });
    };

    const callApiDistrict = (api, callback) => {
        callAPI(api, (data) => {
            setDistricts(data.districts);
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const getAddressString = () => {
        // Kiểm tra xem các trường đã chọn có giá trị không
        if (selectedCity && selectedDistrict && selectedWard) {
            // Lấy tên của thành phố, quận/huyện, và phường/xã đã chọn
            const city = cities.find((city) => city.code === Number(selectedCity))?.name || "";
            const district = districts.find((district) => district.code === Number(selectedDistrict))?.name || "";
            const ward = wards.find((ward) => ward.code === Number(selectedWard))?.name || "";

            // Kết hợp các giá trị để tạo địa chỉ hoàn chỉnh
            const completeAddress = `${ward} - ${district} - ${city}`;

            return completeAddress;
        }

        // Trả về chuỗi rỗng nếu có bất kỳ trường nào chưa được chọn
        return "";
    };




    const handleSave = () => {
        // Kiểm tra xem các trường có giá trị không
        console.log(selectedCity);
        if (selectedCity && selectedCity && selectedWard) {
            onSave([{
                ...editedAddress,
                address: getAddressString()
            }]);
            console.log({
                ...editedAddress,
                address: getAddressString()
            });
        } else {
            // Hiển thị thông báo hoặc thực hiện các xử lý khác khi các trường không hợp lệ
            window.alert("Invalid address fields. Please fill in all required fields.");
            // Hiển thị thông báo hoặc thực hiện xử lý khác ở đây
        }
    };



    return (

        // handle city
        <div>
            <Modal show={true} onHide={onCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Customize the form fields based on your address structure */}
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={editedAddress.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={editedAddress.phone}
                                onChange={handleInputChange}
                                required
                                min={10}
                            />
                        </Form.Group>
                        {/* Add more form fields for other address properties */}
                        <Form.Group controlId="formCity">
                            <Form.Label>City</Form.Label>
                            <select
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    handleCityChange(e);
                                }}
                            >
                                <option value="" disabled>
                                    Chọn tỉnh thành
                                </option>
                                {cities.map((city) => (
                                    <option key={city.code} value={city.code}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </Form.Group>

                        <Form.Group controlId="formDistrict">
                            <Form.Label>District</Form.Label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => {
                                    setSelectedDistrict(e.target.value);
                                    handleDistrictChange(e);
                                }}
                            >
                                <option value="" disabled>
                                    Chọn quận huyện
                                </option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.code}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </Form.Group>

                        <Form.Group controlId="formWard">
                            <Form.Label>Ward</Form.Label>
                            <select
                                value={selectedWard}
                                onChange={(e) => {
                                    setSelectedWard(e.target.value);
                                    handleWardChange(e);
                                }}
                            >
                                <option value="" disabled>
                                    Chọn phường xã
                                </option>
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default EditAddress
// UserProfile.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import ChangePasswordForm from '../components/ChangePasswordForm';
import axios from 'axios';
import localData from "./address.json"

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


    useEffect(() => {
        const cityMap = {};
        const districtMap = {};
        const wardMap = {};

        localData.forEach(item => {
            cityMap[item.CityCode] = item.CityName;
            if (item.CityCode.toString() === selectedCity.toString()) {

                districtMap[item.DistrictCode] = item.DistrictName;
            }
            if (item.DistrictCode.toString() === selectedDistrict.toString()) {
                wardMap[item.WardCode] = item.WardName;
            }
        });

        setCities(Object.entries(cityMap).map(([code, name]) => ({ code, name })));
        setDistricts(Object.entries(districtMap).map(([code, name]) => ({ code, name })));
        setWards(Object.entries(wardMap).map(([code, name]) => ({ code, name })));
    }, [selectedCity, selectedDistrict]);

    const handleCityChange = (event) => {
        const code = event.target.value;
        setSelectedCity(code);
        setSelectedDistrict('');
        setWards([]);
    };

    const handleDistrictChange = (event) => {
        const code = event.target.value;
        setSelectedDistrict(code);
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
                        <Form.Group controlId="formPhone">
                            <Form.Label>Street</Form.Label>
                            <Form.Control
                                type="text"
                                name="street"
                                value={editedAddress.street}
                                onChange={handleInputChange}
                                required
                                min={10}
                            />
                        </Form.Group>
                        {/* Add more form fields for other address properties */}
                        <Form.Group controlId="formCity">
                            <Form.Label>City</Form.Label>
                            <select onChange={handleCityChange} value={selectedCity}>
                                <option value="">
                                    Choose city
                                </option>
                                {cities.map(city => (

                                    <option key={city.code} value={city.code}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>

                        </Form.Group>

                        <Form.Group controlId="formDistrict">
                            <Form.Label>District</Form.Label>
                            <select onChange={handleDistrictChange} value={selectedDistrict}>

                                {districts.map(district => (
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
                                }}
                            >

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
// UserProfile.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import ChangePasswordForm from '../components/ChangePasswordForm';
import axios from 'axios';

const EditAddress = () => {
    const [user, setUser] = useState({
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        addresses: [
            { name: 'Name 1', phone: 'Phone 1', city: 'City 1', district: 'District 1', ward: 'Ward 1', street: 'Street 1' },
            { name: 'Name 2', phone: 'Phone 2', city: 'City 2', district: 'District 2', ward: 'Ward 2', street: 'Street 2' },
            { name: 'Name 3', phone: 'Phone 3', city: 'City 3', district: 'District 3', ward: 'Ward 3', street: 'Street 3' },
            { name: 'Name 4', phone: 'Phone 4', city: 'City 4', district: 'District 4', ward: 'Ward 4', street: 'Street 4' },
        ],
    });


    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);


    const [editedAddresses, setEditedAddresses] = useState([...user.addresses]);

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
            const updatedAddresses = [...editedAddresses];
            updatedAddresses[index].districts = data.districts;
            updatedAddresses[index].city = cityCode;
            setEditedAddresses(updatedAddresses);
        });

    };

    const handleDistrictChange = (event, index) => {
        const districtCode = event.target.value;
        callApiWard(`${host}d/${districtCode}?depth=2`, (data) => {
            const updatedAddresses = [...editedAddresses];
            updatedAddresses[index].wards = data.wards;
            updatedAddresses[index].district = districtCode;
            setEditedAddresses(updatedAddresses);
        });
    };

    const handleWardChange = (event, index) => {
        const wardCode = event.target.value;
        const updatedAddresses = [...editedAddresses];
        updatedAddresses[index].ward = wardCode;
        setEditedAddresses(updatedAddresses);
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
    const handleAddAddress = () => {
        if (editedAddresses.length < 4) {
            setEditedAddresses([...editedAddresses, {}]);
        }
    };

    const handleRemoveAddress = (index) => {
        const updatedAddresses = [...editedAddresses];
        updatedAddresses.splice(index, 1);
        setEditedAddresses(updatedAddresses);
    };

    const handleAddressFieldChange = (e, field, index) => {
        const value = e.target.value;
        const updatedAddresses = [...editedAddresses];
        updatedAddresses[index][field] = value;
        setEditedAddresses(updatedAddresses);
    };

    return (
        <div>
            <select id="city" onChange={(e) => handleCityChange(e, 0)}>
                <option value="" selected>
                    Chọn tỉnh thành
                </option>
                {cities.map((city) => (
                    <option key={city.code} value={city.code}>
                        {city.name}
                    </option>
                ))}
            </select>

            <select id="district" onChange={(e) => handleDistrictChange(e, 0)}>
                <option value="" selected>Chọn quận huyện</option>
                {districts.map(district => (
                    <option key={district.code} value={district.code}>{district.name}</option>
                ))}
            </select>

            <select id="ward" onChange={(e) => handleWardChange(e, 0)}>
                <option value="" selected>Chọn phường xã</option>
                {wards.map(ward => (
                    <option key={ward.code} value={ward.code}>{ward.name}</option>
                ))}
            </select>
        </div>
    )
}

export default EditAddress
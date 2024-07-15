// UserProfile.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import ChangePasswordForm from "../components/ChangePasswordForm";
import axios from "axios";
import localData from "./address.json";
import { ToastContainer, toast } from "react-toastify";

const EditAddress = ({
  address,
  handleAddAddress,
  handleEditAddress,
  onCancel,
  onSave,
  isNewAddress,
}) => {
  const [editedAddress, setEditedAddress] = useState({ ...address, email: "" });
  const [selectedCity, setSelectedCity] = useState(editedAddress.city || "");
  const [selectedDistrict, setSelectedDistrict] = useState(
    editedAddress.district || ""
  );
  const [selectedWard, setSelectedWard] = useState(editedAddress.ward || "");
  const [addressName, setAddressName] = useState("");

  // handle call api address
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // EditAddress.js

  // ...

  useEffect(() => {
    // Khởi tạo maps cho cities, districts và wards
    const cityMap = {};
    const districtMap = {};
    const wardMap = {};

    localData.forEach((item) => {
      cityMap[item.CityCode] = item.CityName;
      if (item.CityCode.toString() === selectedCity.toString()) {
        districtMap[item.DistrictCode] = item.DistrictName;
      }
      if (item.DistrictCode.toString() === selectedDistrict.toString()) {
        wardMap[item.WardCode] = item.WardName;
      }
    });

    setCities(Object.entries(cityMap).map(([code, name]) => ({ code, name })));
    setDistricts(
      Object.entries(districtMap).map(([code, name]) => ({ code, name }))
    );
    setWards(Object.entries(wardMap).map(([code, name]) => ({ code, name })));

    // Đặt giá trị ban đầu cho selectedCity, selectedDistrict và selectedWard dựa trên editedAddress
    if (address.city) {
      const foundCity = Object.entries(cityMap).find(
        ([_, name]) => name === address.city
      );
      if (foundCity) setSelectedCity(foundCity[0]);
    }
    if (address.district) {
      const foundDistrict = Object.entries(districtMap).find(
        ([_, name]) => name === address.district
      );
      if (foundDistrict) setSelectedDistrict(foundDistrict[0]);
    }
    if (address.ward) {
      const foundWard = Object.entries(wardMap).find(
        ([_, name]) => name === address.ward
      );
      if (foundWard) setSelectedWard(foundWard[0]);
    }
  }, [
    selectedCity,
    selectedDistrict,
    address.city,
    address.district,
    address.ward,
  ]);

  // ...

  const handleCityChange = (event) => {
    const code = event.target.value;
    setSelectedCity(code);
    setSelectedDistrict("");
    setWards([]);
    setEditedAddress((prevAddress) => ({
      ...prevAddress,
      city: event.target.options[event.target.selectedIndex].text,
    }));
    address.district = "";
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/; // Regex kiểm tra số điện thoại ở dạng chuẩn Việt Nam
    return phoneRegex.test(phone);
  };

  const handleDistrictChange = (event) => {
    const code = event.target.value;
    setSelectedDistrict(code);
    setEditedAddress((prevAddress) => ({
      ...prevAddress,
      district: event.target.options[event.target.selectedIndex].text,
    }));
    address.ward = "";
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
      const city =
        cities.find((city) => city.code === Number(selectedCity))?.name || "";
      const district =
        districts.find((district) => district.code === Number(selectedDistrict))
          ?.name || "";
      const ward =
        wards.find((ward) => ward.code === Number(selectedWard))?.name || "";

      // Kết hợp các giá trị để tạo địa chỉ hoàn chỉnh
      const completeAddress = `${ward} - ${district} - ${city}`;

      return completeAddress;
    }

    // Trả về chuỗi rỗng nếu có bất kỳ trường nào chưa được chọn
    return "";
  };

  const handleSave = () => {
    if (
      !editedAddress.name ||
      !editedAddress.street ||
      !isValidPhone(editedAddress.phone)
    ) {
      // Check each field and show an error message if necessary
      if (!editedAddress.name) {
        toast.error("Name is required.");
      }
      if (!editedAddress.street) {
        toast.error("Street is required.");
      }
      if (!isValidPhone(editedAddress.phone)) {
        toast.error("Invalid phone number. Please enter a valid phone number.");
      }
      return; // Do not proceed with saving if validation fails
    }

    // Proceed with onSave logic if all validations pass
    onSave(editedAddress);
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
                name="name"
                value={editedAddress.name}
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
            {isNewAddress && (
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editedAddress.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
            {/* Add more form fields for other address properties */}
            {/*...*/}
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <select
                name="City"
                onChange={handleCityChange}
                value={selectedCity}
              >
                <option value="">Choose city</option>
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
                name="District"
                onChange={handleDistrictChange}
                value={selectedDistrict}
              >
                <option value="">Choose district</option>
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
                name="Ward"
                value={selectedWard}
                onChange={(e) => {
                  setSelectedWard(e.target.value);
                  setEditedAddress((prevAddress) => ({
                    ...prevAddress,
                    ward: e.target.options[e.target.selectedIndex].text,
                  }));
                }}
              >
                <option value="">Choose ward</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </Form.Group>
            {/*...*/}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={
              !editedAddress.name ||
              !editedAddress.street ||
              !isValidPhone(editedAddress.phone)
            }
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditAddress;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Pagination,
  Modal,
} from "react-bootstrap";
import { addToCart, editCartItemQuantity } from "../action/cartAction";
import Message from "../components/Message";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import StripeContainer from "../components/StripeContainer";
import emailjs from "@emailjs/browser";
import EditAddress from "../components/EditAddress";
import "./CartScreen.css";

const ITEMS_PER_PAGE = 5; // Adjust as needed
const CartScreen = () => {
  const [success, SetSuccess] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const qty = new URLSearchParams(location.search).get("qty")
    ? new URLSearchParams(location.search).get("qty")
    : 1;
  // Add this state near your other states
  const [showAddressForm, setShowAddressForm] = useState(false);

  const dispatch = useDispatch();

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    district: "",
    ward: "",
    phone: "",
  });

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const [paymentMethod, setPaymentMethod] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [discountCode, setDiscountCode] = useState("");
  const [discountData, setDiscountData] = useState(null);

  const applyDiscount = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      let config = {};
      if (accessToken)
        config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

      const { data } = await axios.get(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/discounts/${discountCode}`,
        config
      );
      // Assuming the API returns an array and you want the first match
      const discount = data;

      if (discount) {
        // Calculate total quantity and subtotal for selected items
        const totalQuantity = selectedItems.reduce(
          (total, itemId) =>
            total + cartItems.find((item) => item.id === itemId)?.qty,
          0
        );
        const subtotal = selectedItems.reduce(
          (total, itemId) =>
            total +
            cartItems.find((item) => item.id === itemId)?.qty *
              cartItems.find((item) => item.id === itemId)?.price,
          0
        );

        // Get the current date and time
        const now = new Date();

        // Parse discount start and end times
        const startTime = new Date(discount.startTime);
        const endTime = new Date(discount.endTime);

        // Check prerequisites and if discount is within the valid period and usage limit has not been exceeded
        if (
          now >= startTime &&
          now <= endTime &&
          (discount.remainingDiscountQuantity === null ||
            discount.remainingDiscountQuantity > 0) &&
          totalQuantity >= discount.prerequisiteQuantityRange &&
          subtotal >= discount.prerequisiteSubtotalRange
        ) {
          setDiscountData(discount);
          toast.success(`Discount code applied`);
          console.log(1);
        } else {
          console.log(2);

          setDiscountData(null);
          if (now < startTime) {
            toast.error("Discount code is not yet active.");
          } else if (now > endTime) {
            toast.error("Discount code has expired.");
          } else if (
            discount.remainingDiscountQuantity !== null &&
            discount.remainingDiscountQuantity <= 0
          ) {
            toast.error("Discount code usage limit has been reached.");
          } else if (totalQuantity < discount.prerequisiteQuantityRange) {
            toast.error(
              `Discount requires a minimum quantity of ${discount.prerequisiteQuantityRange}.`
            );
          } else if (subtotal < discount.prerequisiteSubtotalRange) {
            toast.error(
              `Discount requires a minimum subtotal of $${discount.prerequisiteSubtotalRange.toFixed(
                2
              )}.`
            );
          }
        }
      } else {
        setDiscountData(null);
        toast.error("Invalid discount code.");
      }
    } catch (error) {
      console.error("Error fetching discount data:", error);
      toast.error("Error applying discount code. Please try again.");
    }
  };

  const [discountedSubtotal, setDiscountedSubtotal] = useState(0);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleClosePaymentModal = () => setShowPaymentModal(false);
  const handleShowPaymentModal = () => setShowPaymentModal(true);

  const [userEmail, setUserEmail] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const [selectedItems, setSelectedItems] = useState([]);
  const toggleSelectItem = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  useEffect(() => {
    // Filter out selected items that are not in cartItems
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((itemId) =>
        cartItems.some((item) => item.id === itemId)
      )
    );
  }, [cartItems]);

  useEffect(() => {
    if (discountData) {
      const originalSubtotal = selectedItems.reduce(
        (acc, itemId) =>
          acc +
          cartItems.find((item) => item.id === itemId)?.qty *
            cartItems.find((item) => item.id === itemId)?.price,
        0
      );
      let discountAmount = 0;

      switch (discountData.valueType) {
        case "FIXED_AMOUNT":
          // Apply the fixed amount discount directly
          discountAmount = discountData.value;
          break;
        case "PERCENTAGE":
          // Calculate the percentage discount
          const percentageDiscount =
            (originalSubtotal * discountData.value) / 100;
          // If a max discount value is set, use the minimum of the percentage discount and max discount value
          discountAmount = discountData.maxDiscountValue
            ? Math.max(percentageDiscount, discountData.maxDiscountValue)
            : percentageDiscount;
          break;
        default:
          discountAmount = 0;
      }

      const newSubtotal = Math.max(0, originalSubtotal + discountAmount); // Subtract discount from subtotal, ensure it's not less than 0
      setDiscountedSubtotal(newSubtotal.toFixed(2));
    } else {
      setDiscountedSubtotal(undefined);
    }
  }, [discountData, selectedItems, cartItems]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken") || null;
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data } = await axios.get(
          "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer/addresses",
          config
        );
        setAddresses(data.addresses); // assuming 'data' is an array of address objects
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access:", error);
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("accessToken"); // Remove the token from storage
          navigate("/login"); // Redirect to the login page
        } else {
          console.error("Error fetching addresses:", error);
        }
      }
    };

    fetchAddresses();
  }, []);

  const sendEmail = (orders) => {
    const templateParams = {
      name: customerInfo.first_name + customerInfo.lastName,
      email: userEmail ? userEmail : customerInfo.email,
      my_html: OrderConfirmationEmail(orders),
    };
    emailjs.send(
      "service_6g2chws",
      "template_928whlk",
      templateParams,
      "PSjw63Ie2cQ9NAUsO"
    );
  };

  const handleAddAddress = async (newAddress) => {
    try {
      // Add call to the API to add the new address
      // For example, using the axios library:
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.post(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer/addresses",
        newAddress,
        config
      );
      setAddresses([...addresses, data]); // Update your addresses state
      toast.success("New address added successfully!");
    } catch (error) {
      console.error("Error adding new address:", error);
      toast.error("Failed to add new address. Please try again.");
    }
  };

  const handleEditAddress = async (addressId, updatedAddress) => {
    try {
      // Add call to the API to update the address
      // For example, using the axios library:
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.put(
        `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/customer/addresses/${addressId}`,
        updatedAddress,
        config
      );
      // Update your addresses state with the new address data
      setAddresses(
        addresses.map((addr) => (addr.id === addressId ? data : addr))
      );
      toast.success("Address updated successfully!");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address. Please try again.");
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(editCartItemQuantity(id, 0));
  };

  const editQuantityHandler = (id, newQty) => {
    dispatch(editCartItemQuantity(id, newQty));
  };

  const OrderConfirmationEmail = ({ lineItems, customer, address }) => {
    const totalAmount = lineItems.reduce((total, item) => {
      const itemPrice = cartItems.find(
        (cartItem) => cartItem.id === item.variant_id
      )?.price;
      return total + itemPrice * item.quantity;
    }, 0);
    const html = `
            <div>
                <h2>Order Confirmation</h2>
    
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${customer.first_name} ${
      customer.last_name
    }</p>
                <p><strong>Email:</strong> ${customer.email}</p>
    
                <h3>Shipping Address</h3>
                <p><strong>Address:</strong> ${address.street} - ${
      address.ward
    } - ${address.district} - ${address.city}</p>
                <p><strong>Phone:</strong> ${address.phone}</p>
                <p><strong>Created Time:</strong> ${new Date()}</p>
    
                <h3>Ordered Items</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
  <thead>
    <tr style="background-color: #f2f2f2;">
    <th style="padding: 10px; text-align: left;">Product Name</th>
      <th style="padding: 10px; text-align: left;">Image</th>
      <th style="padding: 10px; text-align: center;">Quantity</th>
      <th style="padding: 10px; text-align: center;">Price</th>
    </tr>
  </thead>
  <tbody>
    ${lineItems
      .map(
        (item) => `
          <tr key=${item.variant_id} style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; text-align: center;">${item.title}
          <br />
          ${item.variant}</td>
            <td style="padding: 10px; text-align: center;"><img src="${
              cartItems.find((cartItem) => cartItem.id === item.variant_id)
                ?.image
            }" alt="Product" style="max-width: 50px; max-height: 50px; border-radius: 5px;"></td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: center;">$${(
              cartItems.find((cartItem) => cartItem.id === item.variant_id)
                ?.price * item.quantity
            ).toFixed(2)}</td>
          </tr>
        `
      )
      .join("")}
  </tbody>
</table>
    
                ${
                  discountCode
                    ? `
                    <h3>Discount</h3>
                    <p><strong>Discount Code:</strong> ${discountCode}</p>
                    <p><strong>Original Subtotal:</strong> $${selectedItems
                      .reduce(
                        (acc, itemId) =>
                          acc +
                          cartItems.find((item) => item.id === itemId)?.qty *
                            cartItems.find((item) => item.id === itemId)?.price,
                        0
                      )
                      .toFixed(3)}</p>
                `
                    : ""
                }
    
                <h3>Total Order Amount</h3>
                <p style="font-size: 18px; color: green;">
                        $${
                          discountedSubtotal
                            ? Number(discountedSubtotal).toFixed(2)
                            : totalAmount.toFixed(2)
                        }
                </p>
    
                <h3>Payment Method</h3>
                <p>${paymentMethod}</p>
    
                <p style="font-size: 16px; color: green;">Thank you for shopping with us!</p>
            </div>
        `;
    return html;
  };

  const createOrder = async () => {
    const lineItems = selectedItems.map((itemId) => {
      const item = cartItems.find((item) => item.id === itemId);
      return {
        variant_id: itemId,
        quantity: item.qty,
        title: item.title,
        variant: item.variant,
        variantId: itemId,
      };
    });
    const customer = {
      first_name: customerInfo.firstName,
      last_name: customerInfo.lastName,
      email: userEmail || customerInfo.email || newAddress.email,
    };

    const fullAddressDetails = newAddress?.street
      ? newAddress
      : addresses.find((addr) => addr.id === Number(selectedAddress));

    const address = {
      name: fullAddressDetails.name,
      city: fullAddressDetails.city,
      phone: fullAddressDetails.phone,
      street: fullAddressDetails.street,
      ward: fullAddressDetails.ward,
      district: fullAddressDetails.district,
    };
    const discountCodes =
      discountData && discountData.title ? [discountData.title] : [];
    const orders = {
      lineItems,
      customer,
      address,
      discountCodes,
      paymentMethod: paymentMethod,
      totalQuantity: selectedItems.reduce((total, itemId) => {
        const item = cartItems.find((item) => item.id === itemId);
        return total + item.qty;
      }, 0),
    };

    console.log(orders);

    try {
      const accessToken = localStorage.getItem("accessToken") || null;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const { data } = await axios.post(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/orders",
        orders
      );

      const removeFunctions = selectedItems.map(
        (itemId) => () => removeFromCartHandler(itemId)
      );

      SetSuccess(true);

      // Gọi các hàm removeFunctions trong một lệnh
      removeFunctions.forEach((removeFunction) => removeFunction());
      toast.success("Checkout success!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      if (orders.customer.email) sendEmail(orders);

      setSelectedItems([]);
      setTimeout(() => {
        if (accessToken) navigate("/MyOrders");
      }, 2000);

      setDiscountedSubtotal(undefined);
    } catch (error) {
      console.log(error);
      if (error.response.data?.message === "Stock doesn't have enough quantity")
        toast.error("Stock doesn't have enough quantity!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      else
        toast.error("Checkout faild!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    }
  };

  const accessToken = localStorage.getItem("accessToken") || null;

  useEffect(() => {
    try {
      if (!accessToken) {
        return;
      }
      const decodedToken = jwtDecode(accessToken);
      setUserEmail(decodedToken.e);
    } catch (error) {
      console.error("Error decoding access token:", error);
    }
  }, [accessToken]);

  const checkoutHandler = () => {
    let selectAd = false;
    if (!isNaN(parseInt(selectedAddress))) selectAd = true;
    else selectAd = false;

    console.log(!selectAd);
    console.log(newAddress.name === "");
    if (!selectAd && newAddress.name === "") {
      toast.warning("Please select an address", {
        // Toast options...
      });
      return;
    }

    const fullAddressDetails = addresses.find(
      (addr) => addr.id === selectedAddress
    );

    if (selectedItems.length < 1) {
      toast.warning("Please select product to checkout", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (paymentMethod === "CARD") {
      handleShowPaymentModal();
    } else if (paymentMethod === "COD") {
      // Handle the COD order submission here
      createOrder();
    } else {
      toast.warning("Please select a payment method");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCartItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(cartItems.length / ITEMS_PER_PAGE); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStripeAmout = () => {
    let totalAmount = selectedItems
      ?.reduce(
        (acc, itemId) =>
          acc +
          cartItems.find((item) => item.id === itemId)?.qty *
            cartItems.find((item) => item.id === itemId)?.price,
        0
      )
      .toFixed(2);

    let finalSubtotal = discountedSubtotal; // Create a new variable for reassignment

    if (finalSubtotal <= 0) finalSubtotal = Number(0.5);
    return finalSubtotal ? Number(finalSubtotal).toFixed(2) : totalAmount;
  };

  return (
    <>
      <ToastContainer />
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Include the StripeContainer component inside the modal body */}
          <StripeContainer
            success={success}
            onSuccess={createOrder}
            amount={getStripeAmout()}
          />
        </Modal.Body>
      </Modal>
      <Row>
        <Col md={12} lg={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to="/">Go Back</Link>{" "}
            </Message>
          ) : (
            <ListGroup variant="flush">
              {currentCartItems.reverse().map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex align-items-center product-item row"
                >
                  {/* Column 1: Image */}
                  <div className="col-md-2 mb-3 d-flex align-items-center justify-content-center">
                    <Link to={`/product/${item.productId}`}>
                      <Image
                        src={item.image}
                        fluid
                        rounded
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </Link>
                  </div>

                  {/* Column 2: Title */}
                  <div className="col-md-4 mb-3 d-flex align-items-center">
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-center text-md-start"
                    >
                      {item.title}
                      <br />
                      {item.variant}
                    </Link>
                  </div>

                  {/* Column 3: Quantity */}
                  <div className="col-md-2 mb-3 d-flex align-items-center justify-content-center">
                    <Form.Control
                      type="number"
                      value={item.qty}
                      min={1}
                      max={item.inStock}
                      onChange={(e) => {
                        const newValue = Math.min(
                          Math.max(1, parseInt(e.target.value, 10)),
                          item.inStock
                        );
                        editQuantityHandler(item.id, newValue);
                      }}
                      className="form-control text-center"
                    />
                  </div>

                  {/* Column 4: Price */}
                  <div className="col-md-2 mb-2 text-sm-center d-flex align-items-center justify-content-center price">
                    ${item.price}
                  </div>

                  {/* Column 5: Remove */}
                  <div className="col-md-1 d-flex align-items-center justify-content-center">
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>

                  {/* Column 6: Select */}
                  <div className="col-md-1 d-flex align-items-center justify-content-center">
                    <Form.Check
                      type="checkbox"
                      id={`select-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      style={{
                        minHeight: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <div className="d-flex justify-content-center">
            <Pagination>
              {pageNumbers.map((number) => (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => paginate(number)}
                >
                  {number}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Col>
        <Col md={12} lg={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>Subtotal ({selectedItems.length})</h3>
                {discountedSubtotal !== undefined ? (
                  <>
                    <h5 style={{ textDecoration: "line-through" }}>
                      $
                      {selectedItems
                        .reduce(
                          (acc, itemId) =>
                            acc +
                            cartItems.find((item) => item.id === itemId)?.qty *
                              cartItems.find((item) => item.id === itemId)
                                ?.price,
                          0
                        )
                        .toFixed(3)}
                    </h5>
                    <h5>${discountedSubtotal}</h5>
                  </>
                ) : (
                  <h5>
                    $
                    {selectedItems
                      .reduce(
                        (acc, itemId) =>
                          acc +
                          cartItems.find((item) => item.id === itemId)?.qty *
                            cartItems.find((item) => item.id === itemId)?.price,
                        0
                      )
                      .toFixed(3)}
                  </h5>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <Form.Group controlId="discountCode">
                      <Form.Label>Discount Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter discount code"
                      />
                    </Form.Group>
                  </Col>
                  <Col className="d-flex align-items-end">
                    <Button
                      onClick={applyDiscount}
                      disabled={!discountCode.trim()}
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <h4>Payment Method</h4>
                <Form>
                  <Form.Check
                    type="radio"
                    label="Visa/Credit card"
                    id="paymentMethodCreditCard"
                    name="paymentMethod"
                    value="CARD"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    checked={paymentMethod === "CARD"}
                  />
                  <Form.Check
                    type="radio"
                    label="Cash on Delivery (COD)"
                    id="paymentMethodCOD"
                    name="paymentMethod"
                    value="COD"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    checked={paymentMethod === "COD"}
                  />
                </Form>
              </ListGroup.Item>
              <ListGroup.Item>
                {/* Checkout button */}

                {/* Customer information form */}
                <Form className="mt-3">
                  <Form.Group controlId="formAddressSelect">
                    <Form.Label>Address</Form.Label>
                    <Form.Select
                      value={selectedAddress}
                      onChange={(e) => {
                        setSelectedAddress(e.target.value);
                        setNewAddress({
                          name: "",
                          street: "",
                          city: "",
                          district: "",
                          ward: "",
                          phone: "",
                        });
                      }}
                      required
                      style={{ width: "100%" }} // Set the width to 100% of the parent container
                    >
                      <option value="">Select Address</option>
                      {addresses?.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.street} - {address.phone} - {address.ward} -{" "}
                          {address.district} - {address.city}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Add Address Button */}

                  <Button
                    variant="primary"
                    className="my-2"
                    size="sm"
                    onClick={() => setShowAddressForm(true)}
                  >
                    New Address
                  </Button>
                  {newAddress?.street && (
                    <p>
                      {" "}
                      {newAddress.street} - {newAddress.phone} -{" "}
                      {newAddress.ward} - {newAddress.district} -{" "}
                      {newAddress.city}
                    </p>
                  )}

                  {/* New Address Form */}
                  {showAddressForm && (
                    <EditAddress
                      isNewAddress={true}
                      address={newAddress}
                      handleAddAddress={() => {}} // Not needed anymore
                      handleEditAddress={() => {}} // Not needed anymore
                      onCancel={() => setShowAddressForm(false)}
                      onSave={(address) => {
                        setNewAddress(address); // Save the new address to state
                        setShowAddressForm(false); // Hide the form upon saving
                      }}
                    />
                  )}

                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Checkout
                  </Button>
                </Form>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;

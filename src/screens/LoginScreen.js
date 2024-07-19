import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { login } from "../action/userAction";
import FormContainer from "../components/FormContainer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginScreen = ({ handleLoginLogout }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error } = userLogin;
  const accessToken = localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null;

  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (accessToken) {
      navigate(redirect);
    }
  }, [navigate, accessToken, redirect]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Email không hợp lệ", {
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

    if (isRegistering) {
      if (!validatePhoneNumber(phone)) {
        toast.error("Số điện thoại phải đúng 10 chữ số", {
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

      if (password.length < 6) {
        toast.error("Mật khẩu ít nhất 6 ký tự", {
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

      const validateName = (name) => {
        const re = /^[A-Za-z]+$/;
        return re.test(name);
      };

      if (!validateName(firstName)) {
        toast.error("First Name chỉ chứa chữ cái", {
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

      if (!validateName(lastName)) {
        toast.error("Last Name chỉ chứa chữ cái", {
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

      try {
        const config = {
          header: {
            "Content-Type": "application/json",
          },
        };

        const { data } = await axios.post(
          "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/auth/register",
          {
            email,
            password,
            firstname: firstName,
            lastname: lastName,
            phone,
          },
          config
        );

        localStorage.setItem("accessToken", data.accessToken);
        handleLoginLogout(true);
        dispatch(login(email, password));
        setIsRegistering(false);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
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
    } else {
      // Handle login here with email and password
      dispatch(login(email, password));
      handleLoginLogout(true);
    }
  };

  return (
    <FormContainer>
      <h1>{isRegistering ? "Register" : "Sign In"}</h1>
      {error && (
        <Message variant="danger">
          Login Faild!, Please check your email and password
        </Message>
      )}
      {loading && <Loader></Loader>}
      <Form onSubmit={submitHandler}>
        {isRegistering && (
          <>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Number Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>
          </>
        )}
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          {isRegistering ? "Register" : "Sign In"}
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          {isRegistering ? "Already have an account?" : "New Customer?"}
          <Link onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? " Sign In" : " Register"}
          </Link>
        </Col>
      </Row>
      <Row className="py-3">
        <Col>
          <Link to="/forgot-password">Forgot password</Link>
        </Col>
      </Row>
      <ToastContainer />
    </FormContainer>
  );
};

export default LoginScreen;

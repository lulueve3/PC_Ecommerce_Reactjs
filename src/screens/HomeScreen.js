import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import productsTest from "../product";
import { Col, Row, Carousel, Card } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import { listProducts } from "../action/productActions";
import "./HomeScreen.css"; // Import the CSS file

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { loading, error, product, pages, page } = productList;

  console.log(product);

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber - 1));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Carousel className="custom-carousel-bg" interval={1500}>
        <Carousel.Item>
          <Link to="/search/ /1">
            <img
              className="d-block w-100"
              src={`${process.env.PUBLIC_URL}/laptop.jpg`}
              alt="Laptop"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to="/search/ /53">
            <img
              className="d-block w-100"
              src={`${process.env.PUBLIC_URL}/cpu.jpg`}
              alt="Laptop văn phòng"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to="/search/ /55">
            <img
              className="d-block w-100"
              src={`${process.env.PUBLIC_URL}/ram.jpg`}
              alt="Laptop văn phòng"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to="/search/ /59">
            <img
              className="d-block w-100"
              src={`${process.env.PUBLIC_URL}/case.jpg`}
              alt="Laptop văn phòng"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </Link>
        </Carousel.Item>
      </Carousel>

      <Row className="mt-5 card-row">
        <Col md={6} className="d-flex justify-content-center">
          <Link to="/buid-pc">
            <Card className="rounded-card">
              <Card.Img
                src={`${process.env.PUBLIC_URL}/buildpc.jpg`}
                alt="Build PC"
              />
            </Card>
          </Link>
        </Col>
        <Col md={6} className="d-flex justify-content-center">
          <Link to="/QnA">
            <Card className="rounded-card">
              <Card.Img src={`${process.env.PUBLIC_URL}/QnA.jpg`} alt="QnA" />
            </Card>
          </Link>
        </Col>
      </Row>

      <h1>Lastest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {product?.map((product) => (
              <Col
                sm={12}
                md={6}
                lg={4}
                xl={3}
                key={product._id}
                className="my-2"
              >
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center">
            <Paginate
              pages={pages}
              page={page + 1}
              keyword={keyword ? keyword : ""}
            ></Paginate>
          </div>
        </>
      )}
    </>
  );
};

export default HomeScreen;

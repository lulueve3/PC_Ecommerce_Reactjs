import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import { listProducts } from "../action/productActions";
import axios from "axios";

const SearchScreen = () => {
  const { keyword, id, pageNumber } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(id || "");
  const [collections, setCollections] = useState([]);

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, product, pages, page } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber - 1, selectedCategory));
  }, [dispatch, keyword, pageNumber, selectedCategory]);

  useEffect(() => {
    getCollections();
  }, []);

  const getCollections = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") || null;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/collections?page=0&size=100&sortBy=id&sortDirection=ASC",
        config
      );
      setCollections(response.data.results);
      console.log(response.data.results);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // Grouping categories by type
  const categoriesGroupedByType = {
    Laptop: [],
    CPU: [],
    RAM: [],
    VGA: [],
    MOTHERBOARD: [],
    COOLER: [],
    CASE: [],
  };

  collections.forEach((collection) => {
    const collectionType = Object.keys(categoriesGroupedByType).find((type) =>
      collection.title.includes(type)
    );
    console.log(collectionType);
    if (collectionType) {
      categoriesGroupedByType[collectionType].push(collection);
      console.log("true");
    }
  });

  return (
    <>
      <Row className="mb-3">
        {Object.keys(categoriesGroupedByType).map(
          (type) =>
            categoriesGroupedByType[type].length > 0 && (
              <Col key={type} md={6} lg={4} className="mb-2">
                <label>Filter by {type}:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-control"
                >
                  <option value="">All</option>
                  {categoriesGroupedByType[type].map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.title}
                    </option>
                  ))}
                </select>
              </Col>
            )
        )}
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {product?.map((product) => (
              <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center">
            <Paginate
              pages={pages}
              page={page + 1}
              keyword={keyword ? keyword : ""}
              search={true}
            ></Paginate>
          </div>
        </>
      )}
    </>
  );
};

export default SearchScreen;

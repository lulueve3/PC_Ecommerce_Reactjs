import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Col, Row, Button } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import { listProducts } from "../action/productActions";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import default styles for rc-slider

const SearchScreen = () => {
  const { keyword, id, pageNumber } = useParams();
  const [filters, setFilters] = useState({});
  const [collections, setCollections] = useState([]);
  const [selectedCategoriesByType, setSelectedCategoriesByType] = useState({
    Laptop: [],
    CPU: [],
    RAM: [],
    VGA: [],
    Others: [],
  });

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, product, pages, page } = productList;

  useEffect(() => {
    dispatch(
      listProducts(
        keyword,
        pageNumber - 1,
        getAllSelectedCategories(),
        filters.priceRange
      )
    );
  }, [dispatch, keyword, pageNumber, selectedCategoriesByType, filters]);

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
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/collections?page=0&size=100&sortBy=id&sortDirection=ASC"
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
    Others: [],
  };

  const handleCategoryChange = (type, e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCategoriesByType((prev) => ({
      ...prev,
      [type]: selectedOptions,
    }));
  };

  const getAllSelectedCategories = () => {
    return Object.values(selectedCategoriesByType).flat();
  };

  collections.forEach((collection) => {
    // Convert collection title to lowercase for comparison
    const collectionTitleLower = collection.title.toLowerCase();

    // Find the type that matches the collection title (case-insensitive)
    const collectionType = Object.keys(categoriesGroupedByType).find((type) =>
      collectionTitleLower.includes(type.toLowerCase())
    );

    if (collectionType) {
      categoriesGroupedByType[collectionType].push(collection);
    } else if (
      ["MOTHERBOARD", "COOLER", "SSD", "HDD", "Case", "Power_Supply"].some(
        (type) => collectionTitleLower.includes(type.toLowerCase())
      )
    ) {
      categoriesGroupedByType.Others.push(collection);
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
                  value={selectedCategoriesByType[type]}
                  onChange={(e) => handleCategoryChange(type, e)}
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

      {/* <Row className="mb-3">
        <Col md={6} lg={4}>
          <h4>Filter by Price:</h4>
          <Slider
            min={1}
            max={10000} // Set maximum price value according to your data
            defaultValue={filters.priceRange}
            onChange={(value) =>
              setFilters((prevFilters) => ({
                ...prevFilters,
                priceRange: value,
              }))
            }
            value={filters.priceRange}
            allowCross={false}
            className="price-slider"
          />
          <div className="d-flex justify-content-between">
            <span>Min: ${filters.priceRange[0]}</span>
            <span>Max: ${filters.priceRange[1]}</span>
          </div>
          <Button
            className="mt-2"
            onClick={() =>
              dispatch(
                listProducts(
                  keyword,
                  pageNumber - 1,
                  getAllSelectedCategories(),
                  filters.priceRange
                )
              )
            }
          >
            Apply Filters
          </Button>
        </Col>
      </Row> */}

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

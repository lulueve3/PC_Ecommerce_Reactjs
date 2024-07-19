import React, { useEffect, useState } from "react";
import { Row, Col, Image, Button, Table, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  deleteProduct,
  listProducts,
  resetCreateProduct,
  listProductDetail,
} from "../action/productActions";
import Paginate from "../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");

  const productList = useSelector((state) => state.productList);
  const { loading, error, product, pages, page } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    dispatch(listProducts(searchKeyword, pageNumber - 1));
  }, [
    dispatch,
    successDelete,
    successCreate,
    pageNumber,
    successUpdate,
    searchKeyword,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(resetCreateProduct());
    navigate("../admin/productList/create");
  };

  const handleEdit = (id) => {
    dispatch(listProductDetail(id));
    navigate(`../admin/productList/${id}/edit`);
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(listProducts(searchKeyword, 0)); // Fetch products with the search keyword
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      <Form inline onSubmit={handleSearchSubmit}>
        <Form.Control
          type="text"
          placeholder="Search..."
          className="mr-sm-2"
          value={searchKeyword}
          onChange={handleSearch}
        />
      </Form>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>IMAGE</th>
                <th>TITLE</th>
                <th>PRICE</th>
                <th>Price 2</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {product?.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link to={`/product/${product.id}`}>{product.id}</Link>
                  </td>
                  <td>
                    <Link to={`/product/${product.id}`}>
                      <Image
                        src={product.image?.src}
                        fluid
                        rounded
                        style={{
                          maxWidth: "150px",
                          maxHeight: "150px",
                          margin: "5px",
                        }}
                      />
                    </Link>
                  </td>
                  <td>{product.title}</td>
                  <td>{product.variants[0]?.price}</td>
                  <td>{product.variants[0]?.compareAtPrice}</td>
                  <td>
                    <Button
                      variant="light"
                      className="btn-sm"
                      onClick={() => handleEdit(product.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <Paginate pages={pages} page={page + 1} link="/admin/productList" />
          </div>
        </>
      )}
    </>
  );
};

export default ProductListScreen;

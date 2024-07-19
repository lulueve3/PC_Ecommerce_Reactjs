import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  const { price, compareAtPrice } = product.variants[0];
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <Card
      className="my-2 p-3 rounded"
      style={{
        backgroundColor: "#f7f7f7",
        height: "100%",
      }}
    >
      <Link to={`/product/${product.id}`}>
        <Card.Img
          src={product.image?.src}
          variant="top"
          style={{ objectFit: "contain", width: "100%", height: "200px" }}
        />
      </Link>
      <Card.Body style={{ height: "100%" }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <Card.Title as="div" style={{ minHeight: "3rem" }}>
            <strong>{product.title}</strong>
          </Card.Title>
        </Link>
        {compareAtPrice.toFixed(2) > 0 && (
          <div>
            <Card.Text as="div" style={{ textDecoration: "line-through" }}>
              ${compareAtPrice.toFixed(2)}
            </Card.Text>
            <Card.Text as="h4" className="text-success">
              ${price.toFixed(2)}{" "}
              <small className="text-muted">({discountPercentage}%)</small>
            </Card.Text>
          </div>
        )}
        {!hasDiscount && (
          <Card.Text as="h4" className="text-success">
            ${price.toFixed(2)}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;

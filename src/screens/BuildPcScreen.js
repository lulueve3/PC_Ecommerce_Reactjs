import React, { useState, useEffect } from "react";
import { Button, Table, Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BuildDetailsModal from "../components/BuildDetailsModal";
import ProductSelectionModal from "../components/ProductSelectionModal";
import axios from "axios";

const BuildPcScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [buildCode, setBuildCode] = useState("");
  const [loadingBuild, setLoadingBuild] = useState(false);
  const [showBuildDetailsModal, setShowBuildDetailsModal] = useState(false);
  const [showProductSelectionModal, setShowProductSelectionModal] = useState({
    show: false,
    componentType: "",
    collectionId: 0,
  });

  const [productSelections, setProductSelections] = useState({
    motherboard: [],
    cpu: [],
    COOLER: [],
    ram: [],
    hdd: [],
    ssd: [],
    vga: [],
    POWER_SUPPLY: [],
    case: [],
  });

  const productCollections = [
    { id: 52, name: "motherboard" },
    { id: 53, name: "cpu" },
    { id: 54, name: "COOLER" },
    { id: 55, name: "ram" },
    { id: 63, name: "hdd" },
    { id: 56, name: "ssd" },
    { id: 57, name: "vga" },
    { id: 58, name: "POWER_SUPPLY" },
    { id: 59, name: "case" },
  ];

  const convertSelectedVariantsToItemsArray = (selectedVariants) => {
    const items = Object.keys(selectedVariants).map((partType) => {
      const variant = selectedVariants[partType];
      return {
        quantity: variant.quantity || 1,
        partType: partType.toUpperCase(),
        partId: variant.id,
      };
    });

    return { items };
  };

  const adjustableQuantityComponents = ["SSD", "HDD", "RAM"];

  const [selectedProducts, setSelectedProducts] = useState({
    mainboard: "",
    cpu: "",
    caseCooler: "",
    ram: "",
    hdd: "",
    ssd: "",
    vga: "",
    powerSupply: "",
    case: "",
  });

  const handleSelectionChange = (componentType, selectedProduct) => {
    setSelectedProducts((prevSelections) => ({
      ...prevSelections,
      [componentType]: selectedProduct || null,
    }));

    if (
      selectedProduct &&
      selectedProduct.variants &&
      selectedProduct.variants.length === 1
    ) {
      const singleVariant = selectedProduct.variants[0];
      const updatedVariant = {
        ...singleVariant,
        quantity: 1,
      };
      setSelectedVariants((prevVariants) => ({
        ...prevVariants,
        [componentType]: updatedVariant,
      }));
    } else {
      setSelectedVariants((prevVariants) => ({
        ...prevVariants,
        [componentType]: null,
      }));
    }
  };

  const handleVariantChange = (componentType, selectedVariantId) => {
    const product = selectedProducts[componentType];
    const variant = product?.variants.find(
      (v) => v.id === parseInt(selectedVariantId)
    );

    const updatedVariant = {
      ...variant,
      quantity: 1,
    };

    setSelectedVariants((prevVariants) => ({
      ...prevVariants,
      [componentType]: updatedVariant || null,
    }));
  };

  const handleQuantityChange = (componentType, newQuantity) => {
    if (newQuantity >= 1) {
      setSelectedVariants((prevVariants) => {
        const updatedVariants = {
          ...prevVariants,
          [componentType]: {
            ...prevVariants[componentType],
            quantity: newQuantity,
          },
        };

        calculateTotalPrice(updatedVariants);

        return updatedVariants;
      });
    }
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedProducts, selectedVariants]);

  const calculateTotalPrice = () => {
    let price = 0;
    Object.keys(selectedVariants).forEach((componentType) => {
      const variant = selectedVariants[componentType];
      if (variant) {
        const quantity = variant.quantity || 1;
        price += variant.price * quantity;
      }
    });
    setTotalPrice(price);
  };

  const fetchComponents = async () => {
    const collectionIds = [52, 53, 55, 63, 56, 57, 58, 54, 59];

    try {
      let newProductSelections = {};

      for (const collection of productCollections) {
        const response = await axios.get(
          `http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/products`,
          {
            params: {
              page: 0,
              size: 100,
              sortBy: "id",
              sortDirection: "ASC",
              collectionIds: collection.id,
            },
          }
        );
        newProductSelections[collection.name] = response.data.results;
      }

      setProductSelections(newProductSelections);
    } catch (error) {
      console.error("Error fetching components:", error);
      toast.error("Failed to fetch components. Please try again.");
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const generatePcBuild = async () => {
    try {
      const convertedItems =
        convertSelectedVariantsToItemsArray(selectedVariants);
      const response = await axios.post(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/pc-builds",
        convertedItems
      );

      setGeneratedCode(response.data.title);

      toast.success(
        `Build ${response.data.title} has been created successfully!`
      );

      navigator.clipboard.writeText(response.data.title);
    } catch (error) {
      console.error("Error creating PC build:", error);
      toast.error("Error creating PC build. Please try again.");
    }
  };

  return (
    <div className="px-0 py-3 col-12">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <Form.Group
          controlId="formBuildCode"
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            marginRight: "10px",
          }}
        >
          <Form.Label style={{ marginBottom: "0", marginRight: "10px" }}>
            Enter Build Code:
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter code"
            value={buildCode}
            onChange={(e) => setBuildCode(e.target.value)}
            style={{ flex: 1 }}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => setShowBuildDetailsModal(true)}
        >
          Load Build
        </Button>
        <BuildDetailsModal
          show={showBuildDetailsModal}
          onHide={() => {
            setShowBuildDetailsModal(false);
          }}
          buildCode={buildCode}
        />
      </div>

      <Table striped bordered hover className="table-custom">
        <thead>
          <tr>
            <th>Component</th>
            <th>Detail</th>
            <th>Action</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(productSelections).map((componentType) => {
            const product = productSelections[componentType]?.find(
              (p) => p.id === selectedProducts[componentType]?.id
            );
            const variants = selectedProducts[componentType]?.variants || [];
            const variant = selectedVariants[componentType];

            return (
              <tr key={componentType}>
                <td>{componentType}</td>
                <td>
                  {product && variant ? (
                    <>
                      <div>{product.title}</div>
                      <div>
                        {variant.title !== "Default Title" ? variant.title : ""}
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        onClick={() =>
                          setShowProductSelectionModal({
                            show: true,
                            componentType,
                            collectionId: productCollections.find(
                              (collection) => collection.name === componentType
                            )?.id,
                          })
                        }
                      >
                        Select {componentType}
                      </Button>
                    </>
                  )}

                  {variants.length > 1 && (
                    <Form.Select
                      value={selectedVariants[componentType]?.id || ""}
                      onChange={(e) =>
                        handleVariantChange(componentType, e.target.value)
                      }
                      hidden={loadingBuild}
                    >
                      <option value="">Select Variant</option>
                      {variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.title || "Default Title"} - ${variant.price}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </td>
                <td>
                  {selectedProducts[componentType]?.id ? (
                    <>
                      <a
                        href={`/product/${selectedProducts[componentType].id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="info">!</Button>
                      </a>
                      {adjustableQuantityComponents.includes(
                        componentType.toUpperCase()
                      ) && (
                        <input
                          type="number"
                          min="1"
                          max="2"
                          value={variant ? variant.quantity : 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              componentType,
                              parseInt(e.target.value)
                            )
                          }
                          style={{ width: "60px" }}
                        />
                      )}
                    </>
                  ) : null}
                </td>
                <td>
                  {selectedVariants[componentType]?.price &&
                    `$${selectedVariants[componentType].price}`}
                </td>
              </tr>
            );
          })}
          <tr>
            <td
              colSpan="3"
              style={{ textAlign: "center", color: "red", fontSize: "1.5em" }}
            >
              Total Price
            </td>
            <td
              style={{ textAlign: "center", color: "red", fontSize: "1.5em" }}
            >
              ${totalPrice.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </Table>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Button
          variant="primary"
          disabled={generatedCode}
          onClick={generatePcBuild}
        >
          Generate Code
        </Button>
        {generatedCode && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
            }}
          >
            <h4 variant="secondary">{generatedCode}</h4>
          </div>
        )}
      </div>
      <ToastContainer />
      <ProductSelectionModal
        show={showProductSelectionModal.show}
        onHide={() =>
          setShowProductSelectionModal({
            show: false,
            componentType: "",
            collectionId: 0,
          })
        }
        onSelect={(product) =>
          handleSelectionChange(
            showProductSelectionModal.componentType,
            product
          )
        }
        collectionId={showProductSelectionModal.collectionId}
      />
    </div>
  );
};

export default BuildPcScreen;

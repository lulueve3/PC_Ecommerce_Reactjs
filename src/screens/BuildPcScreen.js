import React, { useState, useEffect } from 'react';

import { Button, Table, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';



const BuildPcScrenn = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [buildCode, setBuildCode] = useState('');

    useEffect(() => {
        console.log(selectedVariants);
    }, [selectedVariants])

    const [productSelections, setProductSelections] = useState({
        mainboard: [],
        cpu: [],
        caseCooler: [],
        ram: [],
        ssd: [],
        vga: [],
        powerSupply: [],
        case: []
    });

    const convertSelectedVariantsToItemsArray = (selectedVariants) => {
        const items = Object.keys(selectedVariants).map((partType) => {
            const variant = selectedVariants[partType];
            console.log(variant);
            return {
                quantity: variant.quantity || 1, // Số lượng mặc định là 1
                partType: partType.toUpperCase(), // Chuyển partType thành chữ hoa
                partId: variant.id // ID của variant
            };
        });

        return { items };
    };

    // Sử dụng hàm này để chuyển đổi selectedVariants
    const adjustableQuantityComponents = ['SSD', 'HDD', 'RAM'];


    const [selectedProducts, setSelectedProducts] = useState({
        mainboard: '',
        cpu: '',
        caseCooler: '',
        ram: '',
        ssd: '',
        vga: '',
        powerSupply: '',
        case: ''
    });

    const handleShowModal = (product) => {
        setModalContent(product);
        setShowModal(true);
    };

    const handleSelectionChange = (componentType, selectedProductId) => {
        const product = productSelections[componentType].find(p => p.id === parseInt(selectedProductId));

        setSelectedProducts(prevSelections => ({
            ...prevSelections,
            [componentType]: product || null
        }));

        // Nếu chỉ có một variant, tự động chọn nó và cập nhật selectedVariants
        if (product && product.variants && product.variants.length === 1) {
            const singleVariant = product.variants[0];
            setSelectedVariants(prevVariants => ({
                ...prevVariants,
                [componentType]: singleVariant
            }));
        } else {
            // Reset variant selection when a new product is selected
            setSelectedVariants(prevVariants => ({
                ...prevVariants,
                [componentType]: null
            }));
        }

        // Tính toán tổng giá trị các sản phẩm đã chọn

    };

    const handleVariantChange = (componentType, selectedVariantId) => {
        const product = selectedProducts[componentType];
        const variant = product?.variants.find(v => v.id === parseInt(selectedVariantId));

        setSelectedVariants(prevVariants => ({
            ...prevVariants,
            [componentType]: variant || null
        }));

        // Tính toán tổng giá trị các variant đã chọn
    };

    const handleQuantityChange = (componentType, newQuantity) => {
        if (newQuantity >= 1) { // Ensuring that quantity cannot be less than 1
            setSelectedVariants(prevVariants => {
                // Update the quantity for the specific component
                const updatedVariants = {
                    ...prevVariants,
                    [componentType]: { ...prevVariants[componentType], quantity: newQuantity }
                };

                // After state is updated, calculate the total price
                calculateTotalPrice(updatedVariants);

                // Return the updated state
                return updatedVariants;
            });
        }
    };


    useEffect(() => {
        calculateTotalPrice();
    }, [selectedProducts, selectedVariants])

    const calculateTotalPrice = () => {
        let price = 0;
        Object.keys(selectedVariants).forEach(componentType => {
            const variant = selectedVariants[componentType];
            if (variant) {
                const quantity = variant.quantity || 1; // Use the quantity if available, otherwise default to 1
                price += variant.price * quantity;
            }
        });
        setTotalPrice(price);
    };


    // Hàm để sao chép mã
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        toast.success('copied!');
        setTimeout(() => {
            setCopied(false);
        }, 3000); // Hiển thị thông báo trong 3 giây và sau đó ẩn đi
    };

    const fetchComponents = async () => {
        // Danh sách các loại thành phần có thể của PC
        const componentTypes = ['MOTHERBOARD', 'CPU', 'COOLER', 'RAM', 'SSD', 'HDD', 'VGA', 'POWER_SUPPLY', 'CASE'];

        try {
            // Một object tạm thời để lưu trữ các lựa chọn sản phẩm
            let newProductSelections = {};

            // Lặp qua từng loại thành phần và thực hiện các API call tương ứng
            for (const type of componentTypes) {
                const response = await axios.get(`http://localhost:8080/api/products`, {
                    params: {
                        page: 0,
                        size: 100,
                        sortBy: 'id',
                        sortDirection: 'ASC',
                        keyword: type // Sử dụng từ khóa tương ứng với loại thành phần
                    }
                });
                // Cập nhật object tạm thời với dữ liệu mới
                newProductSelections[type] = response.data.results;
            }

            // Cập nhật state 'productSelections' với dữ liệu mới từ tất cả các API call
            setProductSelections(newProductSelections);
        } catch (error) {
            console.error('Error fetching components:', error);
            toast.error('Failed to fetch components. Please try again.');
        }
    };

    const fetchPcBuild = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/pc-builds/code/${buildCode}`);
            const buildData = response.data;
            console.log(buildData);

            // Now, set the selected components and variants based on the fetched data
            const newSelectedProducts = {};
            const newSelectedVariants = {};

            buildData.items.forEach(item => {
                const partType = item.partType.toLowerCase(); // Adjust this if necessary to match your state keys
                newSelectedProducts[partType] = {
                    id: item.part.id,
                    title: item.part.title,
                    variants: [{ id: item.id, title: item.part.variantTitle, price: item.part.price }]
                };
                newSelectedVariants[partType] = {
                    id: item.id,
                    quantity: item.quantity,
                    price: item.part.price
                };
            });

            setSelectedProducts(newSelectedProducts);
            setSelectedVariants(newSelectedVariants);
            calculateTotalPrice(newSelectedVariants); // Recalculate the total price based on the loaded build

        } catch (error) {
            console.error('Error fetching PC build:', error);
            toast.error('Failed to fetch PC build. Please try again.');
        }
    };

    useEffect(() => {
        // Gọi hàm để lấy thông tin sản phẩm cho tất cả các loại thành phần khi component được mount
        fetchComponents();
    }, []);


    // Gọi API để tạo PC mới
    const generatePcBuild = async () => {
        try {
            const convertedItems = convertSelectedVariantsToItemsArray(selectedVariants);
            console.log(convertedItems);
            const response = await axios.post('http://localhost:8080/api/pc-builds', convertedItems);

            // Đặt code mới từ title của response
            setGeneratedCode(response.data.title);

            // Hiển thị thông báo thành công
            toast.success(`Build ${response.data.title} has been created successfully!`);

            // Tự động sao chép code vào clipboard
            navigator.clipboard.writeText(response.data.title);

            console.log('PC Build created:', response.data);
        } catch (error) {
            console.error('Error creating PC build:', error);
            toast.error('Error creating PC build. Please try again.');
        }
    };

    return (
        <div className="px-0 py-3 col-12">
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalContent.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Giá: ${modalContent.price}</p>
                    <p>Số lượng: {modalContent.quantity}</p>
                    {/* Hiển thị hình ảnh nếu có */}
                    {modalContent.image && <img src={modalContent.image} alt={modalContent.title} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Form.Group controlId="formBuildCode" style={{ display: 'flex', flex: 1, alignItems: 'center', marginRight: '10px' }}>
                    <Form.Label style={{ marginBottom: '0', marginRight: '10px' }}>Enter Build Code:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter code"
                        value={buildCode}
                        onChange={(e) => setBuildCode(e.target.value)}
                        style={{ flex: 1 }}
                    />
                </Form.Group>
                <Button variant="primary" onClick={fetchPcBuild}>Load Build</Button>
            </div>

            <Table striped bordered hover className="table-custom">
                <thead>
                    <tr>
                        <th>title</th>
                        <th>Component</th>
                        <th>Detail</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(productSelections).map((componentType) => {
                        const product = productSelections[componentType]?.find(p => p.id === selectedProducts[componentType]?.id);
                        const variants = selectedProducts[componentType]?.variants || [];
                        const variant = selectedVariants[componentType];

                        console.log(componentType);
                        return (
                            <tr key={componentType}>
                                {/* ... Các cell khác như trước */}
                                <td>{componentType}</td>
                                <td>
                                    {product && variant ? (
                                        // If a product and variant are selected, display titles
                                        <>
                                            <div>{product.title}</div>
                                            <div>{variant.title || 'Default Title'}</div>
                                        </>
                                    ) : (
                                        <>
                                            <Form.Select
                                                value={selectedProducts[componentType]?.id || ''}
                                                onChange={(e) => handleSelectionChange(componentType, e.target.value)}
                                            >
                                                <option value="">Select {componentType}</option>
                                                {productSelections[componentType]?.map(product => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.title}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </>
                                    )}

                                    {variants.length > 1 && (

                                        <Form.Select
                                            value={selectedVariants[componentType]?.id || ''}
                                            onChange={(e) => handleVariantChange(componentType, e.target.value)}
                                        >
                                            <option value="">Select Variant</option>
                                            {variants.map(variant => (
                                                <option key={variant.id} value={variant.id}>
                                                    {variant.title || 'Default Title'} - ${variant.price}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    )}
                                </td>
                                <td>
                                    {selectedProducts[componentType]?.id ? (
                                        <>
                                            <a href={`/product/${selectedProducts[componentType].id}`} target="_blank" rel="noopener noreferrer">
                                                <Button variant="info">!</Button>
                                            </a>
                                            {adjustableQuantityComponents.includes(componentType.toUpperCase()) && (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={variant ? variant.quantity : 1}
                                                    onChange={(e) => handleQuantityChange(componentType, parseInt(e.target.value))}
                                                    style={{ width: '60px' }}
                                                />
                                            )}
                                        </>
                                    ) : null}
                                </td>
                                <td>
                                    {/* Hiển thị giá của variant */}
                                    {selectedVariants[componentType]?.price && `$${selectedVariants[componentType].price}`}
                                </td>
                            </tr>

                        );

                    })}
                    <tr>
                        <td colspan="3" style={{ textAlign: 'center', color: 'red', fontSize: '1.5em' }}>Total Price</td>
                        <td style={{ textAlign: 'center', color: 'red', fontSize: '1.5em' }} >${totalPrice.toFixed(2)}</td>
                    </tr>
                </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button variant="primary" disabled={generatedCode} onClick={generatePcBuild}>Generate Code</Button>
                {generatedCode && (
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                        <Button variant="secondary" onClick={copyToClipboard}>{generatedCode}</Button>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default BuildPcScrenn;

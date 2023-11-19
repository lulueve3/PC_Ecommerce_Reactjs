import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createProduct } from '../action/productActions';
import { Row, Col } from 'react-bootstrap';


const ProductCreateScreen = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
    } = productCreate;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [vendor, setVendor] = useState('');
    const [active, setActive] = useState(true);
    const [variants, setVariants] = useState([]);
    const [options, setOptions] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        handleOptionChangeToVariant();
    }, [options]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            createProduct({
                title,
                description,
                vendor,
                active,
                variants,
                options,
                images,
            })
        );
        navigate('/admin/productlist');
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const handleOptionChange = (index, optionIndex, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][optionIndex] = value;
        setOptions(updatedOptions);

    };

    const handleOptionChangeToVariant = () => {
        if (options.length > 0) {
            const result = [{ name: "", price: 0, quantity: 0 }];


            // Duyệt qua mỗi option
            options.forEach((option) => {
                // Tạo mảng mới chứa các biến thể dựa trên giá trị của option
                const newVariants = [];

                // Duyệt qua mỗi giá trị của option và tạo variants
                option.values.forEach((value) => {
                    // Sao chép và mở rộng mỗi phần tử trong mảng kết quả
                    newVariants.push(...result.map((variant) => ({
                        name: variant.name ? `${variant.name}-${value}` : value,
                        price: 0,
                        quantity: 0
                    })));
                });


                // Gán mảng variants mới cho biến kết quả
                result.length = 0;
                result.push(...newVariants);
            });
            setVariants(result);
        }
        else {
            setVariants([]);
        }

    };

    const handleImageChange = (index, imageUrl) => {
        const updatedImages = [...images];
        updatedImages[index] = imageUrl;
        setImages(updatedImages);
    };

    const handleRemoveOption = (indexToRemove) => {
        const updatedOptions = options.filter((_, index) => index !== indexToRemove);
        setOptions(updatedOptions);
    };


    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingCreate && <Loader />}
                {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
                <form onSubmit={submitHandler}>
                    <div className='mb-3'>
                        <label htmlFor='title' className='form-label'>
                            Title
                        </label>
                        <input
                            type='text'
                            className='form-control'
                            id='title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='description' className='form-label'>
                            Description
                        </label>
                        <textarea
                            className='form-control'
                            id='description'
                            rows='3'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='vendor' className='form-label'>
                            Vendor
                        </label>
                        <input
                            type='text'
                            className='form-control'
                            id='vendor'
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                        />
                    </div>

                    <div className='mb-3'>
                        <div className='form-check'>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                id='active'
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                            <label className='form-check-label' htmlFor='active'>
                                Active
                            </label>
                        </div>
                    </div>

                    {options.map((option, index) => (
                        <div key={index} className='mb-3'>
                            <h5>Option {index + 1}</h5>
                            <div className='mb-3'>
                                <label htmlFor={`optionName${index}`} className='form-label'>
                                    Name
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id={`optionName${index}`}
                                    value={option.name}
                                    onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor={`optionValues${index}`} className='form-label'>
                                    Values (comma-separated)
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id={`optionValues${index}`}
                                    value={option.values.join(',')}
                                    onChange={(e) => handleOptionChange(index, 'values', e.target.value.split(','))}
                                />
                            </div>
                            {/* Add button to remove option */}
                            <button
                                type='button'
                                className='btn btn-danger'
                                onClick={() => handleRemoveOption(index)}
                            >
                                Remove Option
                            </button>
                            {/* Add more input fields for other option properties */}
                            {/* ... */}
                        </div>
                    ))}


                    {/* Add button to add more options */}
                    <button
                        type='button'
                        className='btn btn-secondary'
                        onClick={() => setOptions([...options, { name: '', values: [] }])}
                    >
                        Add Option
                    </button>


                    {variants.map((variant, index) => (
                        <div key={variant.name ? variant.name : index} className='mb-3'>
                            <h5>Variant: {variant.name}</h5>
                            <Row className='mb-3'>
                                <Col>
                                    <label htmlFor={`variantPrice${index}`} className='form-label'>
                                        Price
                                    </label>
                                    <input
                                        type='number'
                                        className='form-control'
                                        id={`variantPrice${index}`}
                                        value={variant.price}
                                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <label htmlFor={`variantQuantity${index}`} className='form-label'>
                                        Quantity
                                    </label>
                                    <input
                                        type='number'
                                        className='form-control'
                                        id={`variantQuantity${index}`}
                                        value={variant.quantity}
                                        onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                                    />
                                </Col>
                            </Row>
                            {/* Add more Row/Col for other variant properties */}
                            {/* ... */}
                        </div>
                    ))}

                    {/* Add button to add more variants */}


                    {images.map((imageUrl, index) => (
                        <div key={index} className='mb-3'>
                            <h5>Image {index + 1}</h5>
                            <div className='mb-3'>
                                <label htmlFor={`imageSrc${index}`} className='form-label'>
                                    Image URL
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id={`imageSrc${index}`}
                                    value={imageUrl}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                            </div>
                            {/* Add more input fields for other image properties if needed */}
                        </div>
                    ))}

                    {/* Add button to add more images */}
                    <button
                        type='button'
                        className='btn btn-secondary'
                        onClick={() => setImages([...images, ''])}
                    >
                        Add Image
                    </button>


                    <button type='submit' className='btn btn-primary'>
                        Create
                    </button>
                </form>

            </FormContainer>
        </>
    );
};

export default ProductCreateScreen;

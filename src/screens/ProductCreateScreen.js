import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createProduct } from '../action/productActions';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios'

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
    const [selectImage, setSelectImage] = useState(null);




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
        console.log({
            title,
            description,
            vendor,
            active,
            variants,
            options,
            images,
        }
        );
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

    function getVariantName(variant) {
        console.log(variant);
        const optionNames = Object.keys(variant)
            .filter(key => key.startsWith('option'))
            .map(key => variant[key]);

        return optionNames.join('-');
    }



    const handleOptionChangeToVariant = () => {
        if (options.length > 0) {
            const result = [{ option1: "", option2: "", price: 0, quantity: 0 }];

            // Duyệt qua mỗi option
            options.forEach((option, index) => {
                // Tạo mảng mới chứa các biến thể dựa trên giá trị của option
                const newVariants = [];

                // Duyệt qua mỗi giá trị của option và tạo variants
                option.values.forEach((value) => {
                    // Sao chép và mở rộng mỗi phần tử trong mảng kết quả
                    newVariants.push(...result.map((variant) => ({
                        ...variant,
                        [`option${index + 1}`]: variant[`option${index + 1}`] ? `${variant[`option${index + 1}`]}-${value}` : value,
                    })));
                });

                // Gán mảng variants mới cho biến kết quả
                result.length = 0;
                result.push(...newVariants);
            });

            setVariants(result);
        } else {
            setVariants([]);
        }
    };

    useEffect(() => {
        if (selectImage !== null) {
            uploadImage(selectImage);
        }
    }, [selectImage]);

    const handleImageChange = (index, e) => {
        setSelectImage({
            index: index,
            src: e.target.files[0]
        });
    };

    const uploadImage = async (selectImage) => {
        const index = selectImage.index;
        const data = new FormData()
        data.append('file', selectImage.src);
        data.append('upload_preset', "rctjv3j1");
        data.append('cloud_name', "dommm7bzh");

        const reponse = await axios.post('https://api.cloudinary.com/v1_1/dommm7bzh/image/upload', data)
        const imageUrl = reponse.data.secure_url;
        const newImages = [...images];
        if (!newImages[index]) {
            newImages[index] = {};
        }
        newImages[index].src = imageUrl;
        setImages(newImages);

    }
    const handleRemoveImage = (index) => {
        const newImages = [...images];
        newImages[index] = null; // hoặc bạn có thể sử dụng newImages.splice(index, 1) để loại bỏ ảnh khỏi mảng
        setImages(newImages);
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
                        <div key={index} className='mb-3'>
                            <h5>Variant: {getVariantName(variant)}</h5>

                            <Row className='mb-3'>
                                <Col xs={12} md={5}>
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
                                <Col xs={12} md={4}>
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
                                <Col xs={12} md={3}>
                                    <input type='file' onChange={(e) => handleImageChange(index, e)} />
                                    {!images[index]?.src ? null : (
                                        <div>
                                            <img
                                                src={images[index].src}
                                                alt={`Uploaded Image ${index + 1}`}
                                                style={{ width: '150px', height: '150px' }}
                                            />
                                            <br />
                                            <button onClick={() => handleRemoveImage(index)}>Remove</button>
                                        </div>
                                    )}
                                </Col>

                            </Row>
                            {/* Add more Row/Col for other variant properties */}
                            {/* ... */}
                        </div>
                    ))}

                    {/* Add button to add more variants */}

                    <button type='submit' className='btn btn-primary my-2'>
                        Create
                    </button>
                </form>

            </FormContainer>
        </>
    );
};

export default ProductCreateScreen;

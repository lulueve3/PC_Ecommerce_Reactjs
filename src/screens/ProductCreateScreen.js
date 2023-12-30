import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createProduct } from '../action/productActions';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios'
import Select from 'react-select';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';







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
    const [description, setDescription] = useState('aabc');
    const [vendor, setVendor] = useState('');
    const [active, setActive] = useState(true);
    const [variants, setVariants] = useState([]);
    const [options, setOptions] = useState([]);
    const [images, setImages] = useState([]);
    const [selectImage, setSelectImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [listCollections, setListCollections] = useState([]);

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    const convertHTML = () => {
        const htmlContent = convertToHTML(editorState.getCurrentContent()); // Use convertToHTML
        console.log(htmlContent);
    }

    useEffect(() => {
        convertHTML()
    }, [editorState])

    useEffect(() => {
        handleOptionChangeToVariant();
    }, [options]);

    const submitHandler = (e) => {
        e.preventDefault();
        console.log({
            title,
            description,
            vendor,
            active,
            variants,
            options,
            images,
            collectionIds: selectedCollections
        });

        dispatch(
            createProduct({
                title,
                description,
                vendor,
                active,
                variants,
                options,
                images,
                collectionIds: selectedCollections
            })
        );
        navigate('/admin/productlist');

    };

    useEffect(() => {
        const getCollections = async () => {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                // Handle the case where the access token is not available

                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            const { data } = await axios.get(`http://localhost:8080/api/admin/collections?page=0&size=100&sortBy=id&sortDirection=ASC`, config);
            console.log(data);
            setListCollections(data.results)
        }


        getCollections();
    }, [])

    const handleCollectionChange = (selectedOptions) => {
        // Lấy mảng các giá trị của collection đã chọn
        const selectedValues = selectedOptions.map(option => option.value);
        setSelectedCollections(selectedValues);
    };


    const optionsCollection = listCollections.map(collection => ({
        value: collection.id,
        label: collection.title,
    }));

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];

        // Ensure that the specified index exists in the array
        if (!updatedVariants[index]) {
            // If the index doesn't exist, add a new variant
            updatedVariants[index] = {
                option1: "",  // Replace with your default values
                option2: "",
                option3: "",
                price: 1,
                quantity: 1,
            };
        }

        // Check if the 'price' or 'quantity' field exists before setting its value
        if ((field === 'price' || field === 'quantity') && (value >= 1 || value === '')) {
            updatedVariants[index][field] = value;
        } else {
            updatedVariants[index][field] = 1;
        }

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

        const result = optionNames.join('-');

        // Check if the last character is a hyphen and remove it
        if (result.endsWith('-')) {
            return result.slice(0, -1);
        }

        return result;
    }




    const handleOptionChangeToVariant = () => {
        if (options.length > 0) {
            const result = [{ option1: "", option2: "", option3: "", price: 1, quantity: 1 }];

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



    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setSelectImage(selectedFiles);
    };


    const uploadImage = async (selectedImages) => {
        try {
            setUploading(true);

            for (let index = 0; index < selectedImages.length; index++) {
                const file = selectedImages[index];
                const data = new FormData();

                data.append('file', file);
                data.append('upload_preset', 'rctjv3j1');
                data.append('cloud_name', 'dommm7bzh');

                const response = await axios.post('https://api.cloudinary.com/v1_1/dommm7bzh/image/upload', data);
                const imageUrl = response.data.secure_url;

                setImages((prevImages) => [
                    ...prevImages,
                    {
                        position: index,
                        src: imageUrl,
                    },
                ]);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // Handle error, show a message, etc.
        } finally {
            setUploading(false);
        }
    };



    const handleRemoveImage = (indexToRemove) => {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
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
                <h1>Create Product</h1>
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
                            required
                        />
                    </div>
                    <div className='mb-3' style={{ height: '400px', background: '#f0f2d8', overflow: 'hidden' }}>
                        <label htmlFor='description' className='form-label'>
                            Description
                        </label>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={onEditorStateChange}
                            wrapperClassName="wrapper-class"
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                            editorStyle={{ height: '300px', overflow: 'auto' }} // Adjust the height and overflow as needed
                        />
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
                            required
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

                    <input type='file' onChange={(e) => handleImageChange(e)} multiple />
                    {!images || images.length === 0 ? null : (
                        <div>
                            {images.map((image, index) => (
                                <div key={index}>
                                    <img
                                        src={image.src}
                                        alt={`Uploaded Image ${index + 1}`}
                                        style={{ width: '150px', height: '150px', marginRight: '10px' }}
                                    />
                                    <button onClick={() => handleRemoveImage(index)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <br />
                    <div>
                        <h3>List of Collections</h3>
                        <Select
                            isMulti
                            options={optionsCollection}
                            value={optionsCollection.filter(option => selectedCollections.includes(option.value))}
                            onChange={handleCollectionChange}
                        />
                    </div>


                    {options.length === 0 && (
                        <div className='mb-3'>
                            <h5>Default Variant</h5>

                            <Row className='mb-3'>
                                <Col xs={12} md={5}>
                                    <label htmlFor={`variantPriceDefault`} className='form-label'>
                                        Price
                                    </label>
                                    <input
                                        type='number'
                                        className='form-control'
                                        id={`variantPriceDefault`}
                                        value={(variants[0] && variants[0].price) || 1}  // Check if variants[0] exists before accessing price
                                        onChange={(e) => handleVariantChange(0, 'price', e.target.value)}

                                        required
                                    />
                                </Col>
                                <Col xs={12} md={4}>
                                    <label htmlFor={`variantQuantityDefault`} className='form-label'>
                                        Quantity
                                    </label>
                                    <input
                                        type='number'
                                        className='form-control'
                                        id={`variantQuantityDefault`}
                                        value={(variants[0] && variants[0].quantity) || 1}  // Check if variants[0] exists before accessing quantity
                                        onChange={(e) => handleVariantChange(0, 'quantity', e.target.value)}
                                        min={1}
                                        required
                                    />
                                </Col>
                            </Row>
                        </div>
                    )}

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
                        </div>
                    ))}


                    {/* Add button to add more options */}
                    {options.length < 3 && (
                        <button
                            type='button'
                            className='btn btn-secondary'
                            onClick={() => setOptions([...options, { name: '', values: [] }])}
                        >
                            Add Option
                        </button>
                    )}


                    {variants[0]?.option1 && variants.map((variant, index) => (
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
                                        min={1}
                                        required
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
                                        min={1}
                                        required
                                    />
                                </Col>


                            </Row>
                        </div>
                    ))}


                    <button type='submit' className='btn btn-primary my-2' disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Create'}
                    </button>
                </form>

            </FormContainer>
        </>
    );
};

export default ProductCreateScreen;

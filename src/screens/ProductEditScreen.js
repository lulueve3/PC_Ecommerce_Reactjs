import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetail, updateProduct, } from '../action/productActions';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';




const ProductEditScreen = () => {
    const { id: productId } = useParams();



    const dispatch = useDispatch();
    const navigate = useNavigate()

    const productDetail = useSelector((state) => state.productDetail);
    const { loading, error, product } = productDetail;

    const productUpdate = useSelector((state) => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [vendor, setVendor] = useState('');
    const [active, setActive] = useState(true);
    const [variants, setVariants] = useState([]);
    const [options, setOptions] = useState([]);
    const [images, setImages] = useState([]);
    const [selectImage, setSelectImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [listCollections, setListCollections] = useState([]);
    const [flagCollection, setFlagCollection] = useState(false);


    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    const convertHTML = () => {
        const htmlContent = convertToHTML(editorState.getCurrentContent()); // Use convertToHTML
        return htmlContent
    }

    useEffect(() => {
        dispatch(listProductDetail(productId));
    }, [])

    useEffect(() => {
        const contentState = convertFromHTML(description)
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
    }, [description])

    useEffect(() => {
        if (!product.title || String(product.id) !== String(productId)) {
            dispatch(listProductDetail(productId));
        } else {
            setTitle(product.title);
            setDescription(product.description);

            setVendor(product.vendor);
            setActive(product.active);
            if (product.options[0]?.name === "Title") {
                setOptions([])
            } else {
                setOptions(product.options || []);
            }


            setImages(product.images || []);
            setSelectedCollections([]);

            setSelectedCollections(prevCollections => [
                ...prevCollections,
                ...product.collections.map(col => col.id)
            ]);


        }
    }, [dispatch, productId, product, loading]);



    useEffect(() => {
        handleOptionChangeToVariant();
        setVariants(product.variants || []);
    }, [options]);

    const submitHandler = (e) => {
        e.preventDefault();
        console.log({
            title,
            description: convertHTML(),
            vendor,
            active,
            variants,
            options,
            images,
            collectionIds: selectedCollections
        });


        dispatch(
            updateProduct(productId, {
                title,
                description: convertHTML(),
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
        setFlagCollection(!flagCollection);

        const selectedValues = selectedOptions.map(option => option.value);

        if (selectedValues.length > 0) {

            const uniqueSelectedValues = [...new Set(selectedValues)];
            setSelectedCollections(uniqueSelectedValues);
        }
    };


    useEffect(() => {
        if (selectedCollections.length > 0) {
            updateCollection();
        }
    }, [flagCollection]);

    // Chuyển đổi danh sách collections thành định dạng chấp nhận được bởi React-Select
    const selectOptions = listCollections.map(collection => ({
        value: collection.id,
        label: collection.title,
    }));

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
                options: [""],
                price: 1,
                quantity: 1,
                compareAtPrice: 0
            };
        }

        // Check if the 'price' or 'quantity' field exists before setting its value
        if ((field === 'price' || field === 'quantity') && (value >= 1 || value === '')) {
            updatedVariants[index][field] = value;
        } else {
            if (field === 'compareAtPrice' && value >= 0)
                updatedVariants[index][field] = value;
            else
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
        // Lọc ra các chuỗi không rỗng và nối chúng lại với nhau bằng dấu gạch ngang
        return variant.options.filter(option => option).join('-');
    }




    const handleOptionChangeToVariant = () => {
        if (options.length > 0) {
            let result = [{ options: [], price: 1, quantity: 1, compareAtPrice: 0 }];

            // Iterate over each option
            options.forEach((option, index) => {
                // Create a new array to hold the variants based on the option's values
                let newVariants = [];

                // Iterate over each value of the option to create variants
                option.values.forEach(value => {
                    if (index === 0) {
                        // Initialize the variants with the first option's values
                        newVariants.push({ options: [value], price: 1, quantity: 1, compareAtPrice: 0 });
                    } else {
                        // Copy and extend each variant for the subsequent options
                        newVariants = newVariants.concat(result.map(variant => ({
                            ...variant,
                            options: [...variant.options, value]
                        })));
                    }
                });

                // Replace the result with the newly created variants
                result = newVariants;
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

    const addNewImage = async (index, imageUrl) => {
        try {
            // Retrieve the access token from localStorage
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                toast.warning('Please login again', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            await axios.post(`http://localhost:8080/api/admin/products/${productId}/images`, {
                position: index,
                src: imageUrl,
                width: 0,
                height: 0
            }, config);

        } catch (error) {

        }
    }


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

                addNewImage(index, imageUrl);

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



    const handleRemoveImage = async (e, idToRemove) => {
        e.preventDefault();

        try {
            // Retrieve the access token from localStorage
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                toast.warning('Please login again', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            await axios.delete(`http://localhost:8080/api/admin/products/${productId}/images/${idToRemove}`, config);

        } catch (error) {
            toast.warning('Delete Image faild!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        setImages((prevImages) => prevImages.filter((image) => image.id !== idToRemove));
    };

    const updateCollection = async () => {

        try {
            // Retrieve the access token from localStorage
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                toast.warning('Please login again', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            await axios.patch(`http://localhost:8080/api/admin/products/${productId}/collections`,
                {
                    productId: 1,
                    collectionIds: selectedCollections
                }
                , config);

        } catch (error) {

        }
    };



    const handleRemoveOption = (indexToRemove) => {
        const updatedOptions = options.filter((_, index) => index !== indexToRemove);
        setOptions(updatedOptions);
    };


    return (
        <>
            <div>
                <ToastContainer />
                <Link to='/admin/productlist' className='btn btn-light my-3'>
                    Go Back
                </Link>
                <div className='text-center'><h1>Create Product</h1></div>
                {loadingUpdate && <Loader />}
                {/* {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>} */}
                <form onSubmit={submitHandler}>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Product Information</Card.Title>
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
                            <div className='mb-3' style={{ height: '400px', background: '#FAFAFA', overflow: 'hidden' }}>
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
                        </Card.Body>
                    </Card>



                    <Card className='mb-3'>
                        <Card.Body>
                            <div className='mb-3'>
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
                            </div>
                        </Card.Body>
                    </Card>


                    <br />
                    <Card className='mb-3'>
                        <Card.Body>
                            <div className='mb-3'>
                                <h3>List of Collections</h3>
                                <Select
                                    isMulti
                                    options={optionsCollection}
                                    value={optionsCollection?.filter(option => selectedCollections.includes(option.value))}
                                    onChange={handleCollectionChange}
                                />
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className='mb-3'>
                        <Card.Body>
                            <div className='mb-3'>
                                {options.length === 0 && (
                                    <div className='mb-3'>
                                        <h5>Default Variant</h5>

                                        <Row className='mb-3'>
                                            <Col xs={12} md={3}>
                                                <label htmlFor={`variantPriceDefault`} className='form-label'>
                                                    Price
                                                </label>
                                                <input
                                                    type='number'
                                                    className='form-control'
                                                    id={`variantPriceDefault`}
                                                    value={(variants[0] && variants[0].price) || 1}  // Check if variants[0] exists before accessing price
                                                    onChange={(e) => handleVariantChange(0, 'price', e.target.value)}
                                                    onClick={(e) => e.target.select()}
                                                    required
                                                />
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <label htmlFor={`variantPriceDefault`} className='form-label'>
                                                    Compare-at price
                                                </label>
                                                <input
                                                    type='number'
                                                    className='form-control'
                                                    id={`variantPriceDefault`}
                                                    value={(variants[0] && variants[0].compareAtPrice) || 0}
                                                    onChange={(e) => handleVariantChange(0, 'compareAtPrice', e.target.value)}
                                                    onClick={(e) => e.target.select()}
                                                    min={0}
                                                    required
                                                />
                                            </Col>
                                            <Col xs={12} md={2}>
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
                                                    onClick={(e) => e.target.select()}
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                )}





                                {variants.length > 1 && variants.map((variant, index) => (
                                    <div key={index} className='mb-3'>
                                        <h5>Variant: {getVariantName(variant)}</h5>

                                        <Row className='mb-3'>
                                            <Col xs={12} md={3}>
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
                                                    onClick={(e) => e.target.select()}

                                                    required
                                                />
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <label htmlFor={`variantPrice${index}`} className='form-label'>
                                                    Compare-at price
                                                </label>
                                                <input
                                                    type='number'
                                                    className='form-control'
                                                    id={`variantPrice${index}`}
                                                    value={variant.compareAtPrice}
                                                    onChange={(e) => handleVariantChange(index, 'compareAtPrice', e.target.value)}
                                                    min={1}
                                                    onClick={(e) => e.target.select()}

                                                    required
                                                />
                                            </Col>
                                            <Col xs={12} md={2}>
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
                                                    onClick={(e) => e.target.select()}

                                                    required
                                                />
                                            </Col>


                                        </Row>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>


                    <button type='submit' className='btn btn-primary my-2' disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Update'}
                    </button>
                </form>
            </div>

        </>
    );
};

export default ProductEditScreen;

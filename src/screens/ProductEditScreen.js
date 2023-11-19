import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetail, updateProduct } from '../action/productActions';

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const dispatch = useDispatch();

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

    useEffect(() => {
        if (!product.title || String(product.id) !== String(productId)) {
            dispatch(listProductDetail(productId));
        } else {
            setTitle(product.title);
            setDescription(product.description);
            setVendor(product.vendor);
            setActive(product.active);
            setVariants(product.variants || []);
            setOptions(product.options || []);
        }
    }, [dispatch, productId, product]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            updateProduct({
                _id: productId,
                title,
                description,
                vendor,
                active,
                variants,
                options,
            })
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
        console.log(updatedOptions);
        setOptions(updatedOptions);
    };

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
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
                                        readOnly={false}
                                        type='text'
                                        className='form-control'
                                        id={`optionValues${index}`}
                                        value={option.values.join(',')}
                                        onChange={(e) => handleOptionChange(index, 'values', e.target.value.split(','))}
                                    />
                                </div>
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
                                <h5>Variant {index + 1}</h5>
                                <div className='mb-3'>
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
                                </div>
                                <div className='mb-3'>
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
                                </div>
                                {/* Add more input fields for other variant properties */}
                                {/* ... */}
                            </div>
                        ))}

                        {/* Add button to add more variants */}
                        <button
                            type='button'
                            className='btn btn-secondary'
                            onClick={() => setVariants([...variants, { price: 0, quantity: 0 }])}
                        >
                            Add Variant
                        </button>



                        <button type='submit' className='btn btn-primary'>
                            Update
                        </button>
                    </form>
                )}
            </FormContainer>
        </>
    );
};

export default ProductEditScreen;

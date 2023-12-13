import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'


const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate(`/`);


        }
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <div className="d-flex"> {/* Use d-flex to create a flex container */}
                <Form.Control
                    type='text'
                    name='q'
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder='Search Products...'
                    className='mr-sm-2'
                />
                <Button type='submit' variant='outline-success' className='p-2'>
                    Search
                </Button>
            </div>
        </Form>
    );
}

export default SearchBox
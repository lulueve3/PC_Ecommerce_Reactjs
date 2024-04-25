import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'


const Product = ({ product }) => {
    return (
        <Card className='my-3 p-2 rounded ' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} >
            <Link to={`/product/${product.id}`}>
                <Card.Img src={product.image?.src} variant='top' style={{ objectFit: 'contain', width: '200px', height: '200px' }} />
            </Link>
            <Card.Body className='p-2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <Link to={`/product/${product.id}`} style={{ width: '100%', height: '100%', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', textAlign: 'center' }}>
                    <Card.Title as='div' style={{ height: '100%', width: '100%' }}>
                        <p style={{ height: '90px', fontSize: '0.9rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.title}
                        </p>
                    </Card.Title>
                </Link>
            </Card.Body>



            <Card.Text as='h4'>
                <div className='my-2 text-success'>
                    ${product.variants[0].price}
                </div>
            </Card.Text>

        </Card>
    )
}

export default Product
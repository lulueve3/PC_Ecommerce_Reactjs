import React from 'react'
import { Card } from 'react-bootstrap'


const Product = ({ product }) => {
    return (
        <Card className='my-3 p-3 rounded ' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <a href={`/product/${product.id}`}>
                <Card.Img src={product.images[0].src} variant='top' style={{ objectFit: 'contain', width: '200px', height: '200px' }} />
            </a>
            <Card.Body>
                <a href={`/product/${product.id}`}>
                    <Card.Title as='div'><h3>{product.title}</h3></Card.Title>
                </a>
            </Card.Body>

            <Card.Text as='div'>
                <div className='my-3'>
                    rating: 5
                </div>
            </Card.Text>
            <Card.Text as='h4'>
                <div className='my-3'>
                    ${product.variants[0].price}
                </div>
            </Card.Text>

        </Card>
    )
}

export default Product
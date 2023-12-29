import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, link = '', keyword = ' ', search }) => {
    return pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map(x => (
                <LinkContainer key={x + 1}
                    to={link.length <= 1 ? search ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`
                        : `${link}/page/${x + 1}`
                    }>
                    <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                </LinkContainer>
            ))}
        </Pagination>
    )
}

export default Paginate
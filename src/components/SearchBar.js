import React, { useState } from 'react';

const SearchBar = ({ handleSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex">
            <input type="text" value={query} onChange={handleChange} placeholder="Search..." className="form-control mr-2" style={{ minWidth: '300px' }} />
            <button type="submit" className="btn btn-primary">Search</button>
        </form>
    );
};

export default SearchBar;

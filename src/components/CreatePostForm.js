import React, { useState } from 'react';

const CreatePostForm = ({ handleCreatePost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreatePost({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"></textarea>
            <button type="submit">Create Post</button>
        </form>
    );
};

export default CreatePostForm;

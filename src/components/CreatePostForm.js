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
        <form onSubmit={handleSubmit} className="container">
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                    className="form-control"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Create Post</button>
        </form>
    );
};

export default CreatePostForm;
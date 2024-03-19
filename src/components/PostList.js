import React from 'react';

const PostList = ({ posts }) => {
    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <button>View Post</button>
                </div>
            ))}
        </div>
    );
};

export default PostList;

import React, { Component } from 'react';
import { Link } from 'react-router';

class Blogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogPosts: []
        };
    }

    componentDidMount() {
        // Fetch blog posts list
        this.fetchBlogPosts();
    }

    fetchBlogPosts() {
        // Fetch blog posts list from JSON file
        fetch(`${process.env.PUBLIC_URL || ''}/blogs/blog-posts.json`)
            .then(response => response.json())
            .then(blogPosts => {
                this.setState({ blogPosts });
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                this.setState({ blogPosts: [] });
            });
    }

    render() {
        const { blogPosts } = this.state;

        return (
            <section id="blogs" className="section">
                <div className="container">
                    <h2 className="section-title"><span>Blog</span></h2>
                    <div className="blog-list">
                        {blogPosts.length === 0 ? (
                            <p>No blog posts yet. Check back soon!</p>
                        ) : (
                            blogPosts.map((post) => (
                                <article key={post.id} className="blog-post-item">
                                    <Link to={`/blog/${post.id}`}>
                                        <h3>{post.title}</h3>
                                        <div className="blog-meta">
                                            <span className="blog-date">{post.date}</span>
                                        </div>
                                        <p className="blog-excerpt">{post.excerpt}</p>
                                        <span className="read-more">Read more →</span>
                                    </Link>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

export default Blogs;


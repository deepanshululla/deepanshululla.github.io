import React, { Component } from 'react';
import { Link } from 'react-router';

class Blogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogPosts: [],
            currentPage: 1,
            postsPerPage: 6
        };
        this.handlePageChange = this.handlePageChange.bind(this);
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
                // Sort by date (newest first)
                const sortedPosts = blogPosts.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });
                this.setState({ blogPosts: sortedPosts });
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                this.setState({ blogPosts: [] });
            });
    }

    handlePageChange(pageNumber) {
        this.setState({ currentPage: pageNumber });
        // Scroll to top of blog section
        const blogsSection = document.getElementById('blogs');
        if (blogsSection) {
            blogsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    render() {
        const { blogPosts, currentPage, postsPerPage } = this.state;

        // Calculate pagination
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
        const totalPages = Math.ceil(blogPosts.length / postsPerPage);

        // Generate page numbers
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <section id="blogs" className="section">
                <div className="container">
                    <h2 className="section-title"><span>Blog</span></h2>
                    <div className="blog-list">
                        {blogPosts.length === 0 ? (
                            <p>No blog posts yet. Check back soon!</p>
                        ) : (
                            <>
                                {currentPosts.map((post) => (
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
                                ))}
                                
                                {totalPages > 1 && (
                                    <div className="blog-pagination">
                                        <button
                                            className="pagination-button"
                                            onClick={() => this.handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            aria-label="Previous page"
                                        >
                                            <i className="fa fa-chevron-left"></i>
                                        </button>
                                        
                                        <div className="pagination-numbers">
                                            {pageNumbers.map((number) => {
                                                // Show first page, last page, current page, and pages around current
                                                if (
                                                    number === 1 ||
                                                    number === totalPages ||
                                                    (number >= currentPage - 1 && number <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={number}
                                                            className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                                                            onClick={() => this.handlePageChange(number)}
                                                            aria-label={`Go to page ${number}`}
                                                        >
                                                            {number}
                                                        </button>
                                                    );
                                                } else if (
                                                    number === currentPage - 2 ||
                                                    number === currentPage + 2
                                                ) {
                                                    return (
                                                        <span key={number} className="pagination-ellipsis">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        
                                        <button
                                            className="pagination-button"
                                            onClick={() => this.handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            aria-label="Next page"
                                        >
                                            <i className="fa fa-chevron-right"></i>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

export default Blogs;


import React, { Component } from 'react';
import { Link } from 'react-router';

class Blogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogPosts: [],
            currentPage: 1,
            postsPerPage: 6,
            selectedCategory: 'All',
            searchQuery: ''
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentDidMount() {
        this.fetchBlogPosts();
    }

    fetchBlogPosts() {
        fetch(`${process.env.PUBLIC_URL || ''}/blogs/blog-posts.json`)
            .then(response => response.json())
            .then(blogPosts => {
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
        const blogsSection = document.getElementById('blogs');
        if (blogsSection) {
            blogsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    handleCategoryChange(category) {
        this.setState({
            selectedCategory: category,
            currentPage: 1
        });
    }

    handleSearchChange(e) {
        this.setState({
            searchQuery: e.target.value,
            currentPage: 1
        });
    }

    getAllCategories() {
        const { blogPosts } = this.state;
        const categories = new Set();
        blogPosts.forEach(post => {
            if (post.categories && Array.isArray(post.categories)) {
                post.categories.forEach(cat => categories.add(cat));
            }
        });
        return Array.from(categories).sort();
    }

    estimateReadingTime(post) {
        const excerptWords = post.excerpt ? post.excerpt.split(/\s+/).length : 0;
        const estimatedWords = excerptWords * 15;
        const minutes = Math.max(1, Math.round(estimatedWords / 200));
        return minutes;
    }

    getFilteredPosts() {
        const { blogPosts, selectedCategory, searchQuery } = this.state;
        let filtered = blogPosts;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(post =>
                post.categories && post.categories.includes(selectedCategory)
            );
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(post => {
                const titleMatch = post.title && post.title.toLowerCase().includes(query);
                const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(query);
                const categoryMatch = post.categories && post.categories.some(cat => cat.toLowerCase().includes(query));
                return titleMatch || excerptMatch || categoryMatch;
            });
        }

        return filtered;
    }

    render() {
        const { currentPage, postsPerPage, selectedCategory, searchQuery } = this.state;

        const filteredPosts = this.getFilteredPosts();
        const allCategories = this.getAllCategories();

        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <section id="blogs" className="section">
                <div className="container">
                    <h2 className="section-title"><span>Blog</span></h2>

                    {/* Search Bar */}
                    <div className="blog-search-wrapper">
                        <i className="fa fa-search blog-search-icon"></i>
                        <input
                            type="text"
                            className="blog-search-input"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={this.handleSearchChange}
                        />
                    </div>

                    {/* Category Filter */}
                    {allCategories.length > 0 && (
                        <div className="blog-categories">
                            <button
                                className={`category-filter ${selectedCategory === 'All' ? 'active' : ''}`}
                                onClick={() => this.handleCategoryChange('All')}
                            >
                                All
                            </button>
                            {allCategories.map(category => (
                                <button
                                    key={category}
                                    className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => this.handleCategoryChange(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="blog-list">
                        {filteredPosts.length === 0 ? (
                            <p>No blog posts found. Try a different search or category.</p>
                        ) : (
                            <>
                                {currentPosts.map((post) => (
                                    <article key={post.id} className="blog-post-item">
                                        <Link to={`/blog/${post.id}`}>
                                            <h3>{post.title}</h3>
                                            <div className="blog-meta">
                                                <span className="blog-date">{post.date}</span>
                                                <span className="blog-read-time">
                                                    <i className="fa fa-clock-o"></i> {this.estimateReadingTime(post)} min read
                                                </span>
                                                {post.categories && post.categories.length > 0 && (
                                                    <div className="blog-categories-list">
                                                        {post.categories.map((category, index) => (
                                                            <span key={index} className="blog-category-tag">
                                                                {category}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
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

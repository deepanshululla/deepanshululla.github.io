import React, { Component } from 'react';
import { Link } from 'react-router';
import marked from 'marked';

class BlogPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            content: '',
            loading: true,
            error: null,
            allPosts: [],
            currentPost: null,
            prevPost: null,
            nextPost: null
        };
    }

    componentDidMount() {
        const postId = this.props.params?.id;
        if (postId) {
            this.fetchBlogPost(postId);
            this.fetchAllPosts(postId);
        }
    }

    componentDidUpdate(prevProps) {
        const currentPostId = this.props.params?.id;
        const prevPostId = prevProps.params?.id;
        if (currentPostId && currentPostId !== prevPostId) {
            this.fetchBlogPost(currentPostId);
            this.fetchAllPosts(currentPostId);
        }
    }

    fetchAllPosts(currentId) {
        fetch(`${process.env.PUBLIC_URL || ''}/blogs/blog-posts.json`)
            .then(response => response.json())
            .then(posts => {
                const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                const currentIndex = sorted.findIndex(p => p.id === currentId);
                this.setState({
                    allPosts: sorted,
                    currentPost: currentIndex >= 0 ? sorted[currentIndex] : null,
                    prevPost: currentIndex > 0 ? sorted[currentIndex - 1] : null,
                    nextPost: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null
                });
            })
            .catch(() => {});
    }

    fetchBlogPost(postId) {
        this.setState({ loading: true, error: null });

        const markdownUrl = `${process.env.PUBLIC_URL || ''}/blogs/${postId}.md`;

        fetch(markdownUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Blog post not found');
                }
                return response.text();
            })
            .then(markdown => {
                const parseMarkdown = typeof marked === 'function'
                    ? marked
                    : (marked && marked.parse)
                        ? marked.parse
                        : (marked && marked.default)
                            ? marked.default
                            : marked;
                const html = parseMarkdown(markdown);
                this.setState({
                    content: html,
                    loading: false,
                    post: { id: postId }
                });
            })
            .catch(error => {
                this.setState({
                    error: error.message,
                    loading: false
                });
            });
    }

    render() {
        const { content, loading, error, currentPost, prevPost, nextPost } = this.state;

        if (loading) {
            return (
                <section id="blog-post" className="section">
                    <div className="container">
                        <p>Loading...</p>
                    </div>
                </section>
            );
        }

        if (error) {
            return (
                <section id="blog-post" className="section">
                    <div className="container">
                        <h2>Blog Post</h2>
                        <p>Error: {error}</p>
                        <Link to="/blog">← Back to Blog</Link>
                    </div>
                </section>
            );
        }

        return (
            <section id="blog-post" className="section">
                <div className="container">
                        <Link to="/blog" className="back-link">← Back to Blog</Link>

                    {currentPost && currentPost.categories && currentPost.categories.length > 0 && (
                        <div className="post-categories">
                            {currentPost.categories.map((cat, i) => (
                                <span key={i} className="blog-category-tag">{cat}</span>
                            ))}
                        </div>
                    )}

                    <article className="blog-post-content">
                        <div
                            className="blog-post-body"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </article>

                    {(prevPost || nextPost) && (
                        <nav className="post-nav">
                            <div className="post-nav-link post-nav-prev">
                                {prevPost && (
                                    <Link to={`/blog/${prevPost.id}`}>
                                        <i className="fa fa-chevron-left"></i>
                                        <span className="post-nav-label">Previous</span>
                                        <span className="post-nav-title">{prevPost.title}</span>
                                    </Link>
                                )}
                            </div>
                            <div className="post-nav-link post-nav-next">
                                {nextPost && (
                                    <Link to={`/blog/${nextPost.id}`}>
                                        <span className="post-nav-label">Next</span>
                                        <span className="post-nav-title">{nextPost.title}</span>
                                        <i className="fa fa-chevron-right"></i>
                                    </Link>
                                )}
                            </div>
                        </nav>
                    )}
                </div>
            </section>
        );
    }
}

export default BlogPost;

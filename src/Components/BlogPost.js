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
            error: null
        };
    }

    componentDidMount() {
        const postId = this.props.params?.id;
        if (postId) {
            this.fetchBlogPost(postId);
        }
    }

    componentDidUpdate(prevProps) {
        const currentPostId = this.props.params?.id;
        const prevPostId = prevProps.params?.id;
        if (currentPostId && currentPostId !== prevPostId) {
            this.fetchBlogPost(currentPostId);
        }
    }

    fetchBlogPost(postId) {
        this.setState({ loading: true, error: null });
        
        // Fetch the markdown file
        const markdownUrl = `${process.env.PUBLIC_URL || ''}/blogs/${postId}.md`;
        
        fetch(markdownUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Blog post not found');
                }
                return response.text();
            })
            .then(markdown => {
                // Parse markdown to HTML
                // Handle both function and object exports
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
        const { content, loading, error } = this.state;

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
                    <article className="blog-post-content">
                        <div 
                            className="blog-post-body"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </article>
                </div>
            </section>
        );
    }
}

export default BlogPost;


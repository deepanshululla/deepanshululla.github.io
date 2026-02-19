import React, { Component } from 'react';
import { Link } from 'react-router';
import marked from 'marked';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/github-dark-dimmed.css';

hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('yaml', yaml);

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

    componentDidUpdate(prevProps, prevState) {
        const currentPostId = this.props.params?.id;
        const prevPostId = prevProps.params?.id;
        if (currentPostId && currentPostId !== prevPostId) {
            this.fetchBlogPost(currentPostId);
            this.fetchAllPosts(currentPostId);
        }
        if (this.state.content && this.state.content !== prevState.content) {
            this.highlightCode();
        }
    }

    highlightCode() {
        const el = document.querySelector('.blog-post-body');
        if (el) {
            el.querySelectorAll('pre code').forEach(block => {
                if (!block.classList.contains('language-mermaid')) {
                    hljs.highlightElement(block);
                }
            });
            this.renderMermaid(el);
        }
    }

    renderMermaid(el) {
        const mermaidBlocks = el.querySelectorAll('code.language-mermaid');
        if (mermaidBlocks.length === 0) return;

        const loadAndRender = () => {
            if (window.mermaid) {
                window.mermaid.initialize({
                    startOnLoad: false,
                    theme: 'base',
                    themeVariables: {
                        primaryColor: '#fff0f3',
                        primaryTextColor: '#2d3748',
                        primaryBorderColor: '#ff9bb5',
                        lineColor: '#ff9bb5',
                        secondaryColor: '#f0f7ff',
                        tertiaryColor: '#faf5f0',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '14px'
                    }
                });
                mermaidBlocks.forEach((block, i) => {
                    const pre = block.parentElement;
                    const div = document.createElement('div');
                    div.className = 'mermaid';
                    div.textContent = block.textContent;
                    pre.parentElement.replaceChild(div, pre);
                });
                window.mermaid.run();
            }
        };

        if (window.mermaid) {
            loadAndRender();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
            script.onload = loadAndRender;
            document.head.appendChild(script);
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

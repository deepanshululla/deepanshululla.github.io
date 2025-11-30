import React, { Component } from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios'

import Header from './Header';
import About from './About';
import Education from './Education';
import Work from './Work';
import Skills from './Skills';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Blogs from './Blogs';
import BlogPost from './BlogPost';
import { Footer } from './Footer';
import { resumeData } from "./resumeData";


export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resumeData: {}
        };
        this.getResumeData = this.getResumeData.bind(this);
    }

    getResumeData() {
        this.setState({ resumeData: resumeData }, () => {
            // Apply theme after state is set
            this.applyTheme();
        });
    }

    applyTheme() {
        if (this.state.resumeData && this.state.resumeData.theme) {
            const theme = this.state.resumeData.theme;

            // List of all available theme class names (matching CSS file names without .css)
            const allThemes = ['dark-tech-theme', 'minimalist-professional', 'neubrutalism'];

            // Remove all theme classes
            allThemes.forEach(themeClass => {
                document.body.classList.remove(themeClass);
            });

            // Apply the selected theme (theme name should match CSS file name without .css)
            // neopolitan is the default/base theme, so no class needed
            if (theme !== 'neopolitan' && allThemes.includes(theme)) {
                document.body.classList.add(theme);
            }

            // Set bonsai background image for minimalist-professional theme
            if (theme === 'minimalist-professional') {
                const bonsaiUrl = `${process.env.PUBLIC_URL || ''}/images/bonsai.jpg`;
                document.documentElement.style.setProperty('--bonsai-bg', `url(${bonsaiUrl})`);
            }
        }
    }

    componentDidMount() {
        this.getResumeData();
    }

    componentDidUpdate(prevProps, prevState) {
        // Apply theme when resumeData changes
        if (prevState.resumeData?.theme !== this.state.resumeData?.theme) {
            this.applyTheme();
        }
    }

    render() {
        const MainContent = (props) => {
            React.useEffect(() => {
                if (props.location && props.location.query && props.location.query.section) {
                    const sectionId = props.location.query.section;
                    // Small timeout to ensure DOM is ready
                    setTimeout(() => {
                        const element = document.getElementById(sectionId);
                        if (element) {
                            // Use jQuery animate for consistency with init.js smooth scroll
                            // or just native scrollIntoView
                            // Using native for simplicity first, but init.js uses jQuery.
                            // Let's try native first.
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }
            }, [props.location]);

            return (
                <div>
                    <Header data={this.state.resumeData.main} isHome={true} />
                    <About data={this.state.resumeData.main} />
                    <Education data={this.state.resumeData.resume} />
                    <Work data={this.state.resumeData.resume} />
                    <Skills data={this.state.resumeData.resume} />
                    <Projects data={this.state.resumeData.portfolio} />
                    <Testimonials data={this.state.resumeData.testimonials} />
                    <Contact data={this.state.resumeData.main} />
                    <Footer />
                </div>
            );
        };

        const BlogPage = () => (
            <div>
                <Header data={this.state.resumeData.main} showHero={false} isHome={false} />
                <Blogs />
                <Footer />
            </div>
        );

        const BlogPostPage = (props) => (
            <div>
                <Header data={this.state.resumeData.main} showHero={false} isHome={false} />
                <BlogPost params={props.params} />
                <Footer />
            </div>
        );

        return (
            <Router history={hashHistory}>
                <Route path="/" component={MainContent} />
                <Route path="/blog" component={BlogPage} />
                <Route path="/blog/:id" component={BlogPostPage} />
            </Router>
        )
    }
}
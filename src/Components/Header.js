import React, { Component } from 'react';
import { Link } from 'react-router';


class Header extends Component {
    render() {
        const showHero = this.props.showHero !== false; // Default to true if not specified
        
        if (this.props.data) {
            var name = this.props.data.name;
            var occupation = this.props.data.occupation;
            var description = this.props.data.description;
            var city = this.props.data.address.city;
            var networks = this.props.data.social.map(function (network) {
                return <li key={network.name}><a href={network.url} target="_blank" rel="noopener noreferrer"><i className={network.className}></i></a></li>
            });
        }

        return (
            <header id="home" className={`header ${!showHero ? 'no-hero' : ''}`}>
                <nav id="nav-wrap" className="nav-container">
                    <ul id="nav" className="nav-list">
                        <li className="current"><a className="smoothscroll" href="#home">Home</a></li>
                        <li><a className="smoothscroll" href="#about">About</a></li>
                        <li><a className="smoothscroll" href="#education">Education</a></li>
                        <li><a className="smoothscroll" href="#work">Work</a></li>
                        <li><a className="smoothscroll" href="#skills">Skills</a></li>
                        <li><a className="smoothscroll" href="#portfolio">Projects</a></li>
                        <li><a className="smoothscroll" href="#testimonials">Testimonials</a></li>
                        <li><a className="smoothscroll" href="#contact">Contact</a></li>
                        <li><Link to="/blog">Blog</Link></li>
                    </ul>
                </nav>

                {showHero && (
                    <div 
                        className="hero-section"
                        style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL || ''}/images/bonsai.jpg)`
                        }}
                    >
                        <div className="hero-content fade-in">
                            <h1 className="responsive-headline">{name}</h1>
                            <h3 className="hero-subtitle">I am a {city} based <span>{occupation}</span>. {description}</h3>
                            <hr className="hero-divider" />
                            <ul className="social-links">
                                {networks}
                            </ul>
                            <div className="scrolldown">
                                <a className="smoothscroll" href="#about"><i className="icon-down-circle"></i></a>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        );
    }
}

export default Header;

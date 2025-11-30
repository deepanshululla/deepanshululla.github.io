import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';


class Header extends Component {
    render() {
        const showHero = this.props.showHero !== false; // Default to true if not specified
        const isHome = this.props.isHome !== false; // Default to true if not specified

        if (this.props.data) {
            var name = this.props.data.name;
            var occupation = this.props.data.occupation;
            var description = this.props.data.description;
            var city = this.props.data.address.city;
            var networks = this.props.data.social.map(function (network) {
                return <li key={network.name}><a href={network.url} target="_blank" rel="noopener noreferrer"><i className={network.className}></i></a></li>
            });
        }

        const handleNavClick = (e, id) => {
            if (!isHome) {
                e.preventDefault();
                hashHistory.push('/?section=' + id);
            }
        };

        return (
            <header id="home" className={`header ${!showHero ? 'no-hero' : ''}`}>
                <nav id="nav-wrap" className="nav-container">
                    <ul id="nav" className="nav-list">
                        <li className="current"><a className="smoothscroll" href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
                        <li><a className={isHome ? "smoothscroll" : ""} href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
                        <li><a className={isHome ? "smoothscroll" : ""} href="#education" onClick={(e) => handleNavClick(e, 'education')}>Education</a></li>
                        <li><a className={isHome ? "smoothscroll" : ""} href="#work" onClick={(e) => handleNavClick(e, 'work')}>Work</a></li>
                        <li><a className={isHome ? "smoothscroll" : ""} href="#skills" onClick={(e) => handleNavClick(e, 'skills')}>Skills</a></li>
                        <li><a className={isHome ? "smoothscroll" : ""} href="#portfolio" onClick={(e) => handleNavClick(e, 'portfolio')}>Projects</a></li>
                        <li><a className={isHome ? "smoothscroll" : ""} href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')}>Testimonials</a></li>
                        <li><a className={isHome ? "smoothscroll" : ""} href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
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

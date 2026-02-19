import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            activeSection: 'home'
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.sectionObserver = null;
    }

    toggleMenu() {
        this.setState(prevState => ({ menuOpen: !prevState.menuOpen }));
    }

    closeMenu() {
        this.setState({ menuOpen: false });
    }

    componentDidMount() {
        if (this.props.isHome !== false) {
            this.initSectionObserver();
        }
    }

    componentWillUnmount() {
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
    }

    initSectionObserver() {
        const sectionIds = ['home', 'about', 'education', 'work', 'skills', 'portfolio', 'testimonials', 'contact'];

        this.sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setState({ activeSection: entry.target.id });
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
        );

        // Delay to ensure DOM is ready
        setTimeout(() => {
            sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    this.sectionObserver.observe(el);
                }
            });
        }, 300);
    }

    render() {
        const showHero = this.props.showHero !== false;
        const isHome = this.props.isHome !== false;
        const { menuOpen, activeSection } = this.state;

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
            this.closeMenu();
            if (!isHome) {
                e.preventDefault();
                hashHistory.push('/?section=' + id);
            }
        };

        const navItems = [
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'education', label: 'Education' },
            { id: 'work', label: 'Work' },
            { id: 'skills', label: 'Skills' },
            { id: 'portfolio', label: 'Projects' },
            { id: 'testimonials', label: 'Testimonials' },
            { id: 'contact', label: 'Contact' }
        ];

        return (
            <header id="home" className={`header ${!showHero ? 'no-hero' : ''}`}>
                <nav id="nav-wrap" className={`nav-container ${menuOpen ? 'nav-open' : ''}`}>
                    <button className="nav-hamburger" onClick={this.toggleMenu} aria-label="Toggle navigation">
                        <span className="hamburger-bar"></span>
                        <span className="hamburger-bar"></span>
                        <span className="hamburger-bar"></span>
                    </button>
                    <ul id="nav" className="nav-list">
                        {navItems.map(item => (
                            <li key={item.id} className={activeSection === item.id ? 'current' : ''}>
                                <a
                                    className={isHome ? 'smoothscroll' : ''}
                                    href={`#${item.id}`}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                        <li><Link to="/blog" onClick={this.closeMenu}>Blog</Link></li>
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

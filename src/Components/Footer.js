import React from 'react';


export const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer-content">
                <ul className="social-links footer-social">
                    <li><a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/deepanshululla"><i className="fa fa-linkedin"></i></a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/deepanshululla"><i className="fa fa-github"></i></a></li>
                </ul>
            <div className="copyright">
                &copy; {new Date().getFullYear()} Deepanshu Lulla. All rights reserved.
            </div>
            </div>
        </div>
    </footer>
)
import React from 'react';
import Header from './Header';
import { Footer } from './Footer';
import { resumeData } from './resumeData';

const Layout = ({ children }) => {
    return (
        <div className="App">
            <Header data={resumeData.main} />
            {children}
            <Footer />
        </div>
    );
};

export default Layout;


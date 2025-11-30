import React, { Component } from 'react';

class About extends Component {
    render() {
        if (this.props.data) {
            var name = this.props.data.name;
            var image = 'images/' + this.props.data.image;
            var bio = this.props.data.bio;
            var street = this.props.data.address.street;
            var city = this.props.data.address.city;
            var state = this.props.data.address.state;
            var zip = this.props.data.address.zip;
            var phone = this.props.data.phone;
            var email = this.props.data.email;
            var resumeDownload = this.props.data.resumedownload;
        }

        return (
            <section id="about" className="section about-section">
                <div className="container">
                    <div className="about-content">
                        <div className="about-image-wrapper fade-in">
                            <img className="profile-pic" src={image} alt={name} />
                        </div>
                        <div className="about-text fade-in">
                            <h2>About Me</h2>
                            <p>{bio}</p>
                            <div className="contact-row">
                                <div className="contact-details">
                                    <h3>Contact Details</h3>
                                    <p className="address">
                                        <span>{name}</span><br />
                                        <span>{street}<br />
                                            {city}, {state} {zip}
                                        </span><br />
                                        <span>{phone}</span><br />
                                        <span>{email}</span>
                                    </p>
                                </div>
                                <div className="download-btn-wrapper">
                                    <a href={resumeDownload} className="btn"><i className="fa fa-download"></i> Download Resume</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default About;

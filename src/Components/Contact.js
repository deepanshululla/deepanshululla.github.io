import React, { Component } from 'react';

class Contact extends Component {
    render() {
        if (this.props.data) {
            var email = this.props.data.email;
        }
        return (
            <section id="contact" className="section contact-section">
                <div className="container">
                    <div className="contact-wrapper fade-in">
                        <div className="contact-header">
                            <i className="fa fa-envelope contact-icon"></i>
                            <h2 className="contact-title">Get In Touch</h2>
                        </div>
                        <p className="contact-lead">
                            I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>
                        <div className="contact-actions">
                            <a href={`mailto:${email}`} className="btn btn-large">Say Hello</a>
                        </div>
                        <p className="contact-email-text">
                            Or email me at: <a href={`mailto:${email}`}>{email}</a>
                        </p>
                    </div>
                </div>
            </section>
        );
    }
}

export default Contact;

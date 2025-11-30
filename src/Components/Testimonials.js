import React, { Component } from 'react';

class Testimonials extends Component {
    render() {
        if (this.props.data) {
            var testimonials = this.props.data.testimonials.map((testimonial, index) => {
                return <li key={index} className="testimonial-item">
                    <blockquote className="testimonial-quote">
                        <p>"{testimonial.text}"</p>
                        <cite>{testimonial.user}</cite>
                    </blockquote>
                </li>
            });
        }
        return (
            <section id="testimonials" className="section testimonials-section">
                <div className="container">
                    <h2 className="section-title center"><span>Testimonials</span></h2>
                    <div className="testimonials-wrapper">
                        <ul className="testimonials-list">
                            {testimonials}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}

export default Testimonials;

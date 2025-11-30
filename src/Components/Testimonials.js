import React, { Component } from 'react';

class Testimonials extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            testimonials: []
        };
        this.nextTestimonial = this.nextTestimonial.bind(this);
        this.prevTestimonial = this.prevTestimonial.bind(this);
        this.goToTestimonial = this.goToTestimonial.bind(this);
        this.startAutoRotate = this.startAutoRotate.bind(this);
        this.stopAutoRotate = this.stopAutoRotate.bind(this);
        this.autoRotate = null;
    }

    startAutoRotate() {
        if (this.autoRotate) {
            clearInterval(this.autoRotate);
        }
        const testimonials = this.state.testimonials.length > 0 
            ? this.state.testimonials 
            : (this.props.data?.testimonials || []);
        
        if (testimonials.length > 1) {
            this.autoRotate = setInterval(() => {
                this.nextTestimonial();
            }, 5000);
        }
    }

    stopAutoRotate() {
        if (this.autoRotate) {
            clearInterval(this.autoRotate);
            this.autoRotate = null;
        }
    }

    componentDidMount() {
        if (this.props.data && this.props.data.testimonials) {
            this.setState({ testimonials: this.props.data.testimonials }, () => {
                // Start auto-rotation after state is set
                this.startAutoRotate();
            });
        }
    }

    componentDidUpdate(prevProps) {
        // Update testimonials if props change
        if (this.props.data && this.props.data.testimonials && 
            prevProps.data?.testimonials !== this.props.data.testimonials) {
            this.setState({ testimonials: this.props.data.testimonials }, () => {
                this.startAutoRotate();
            });
        }
    }

    componentWillUnmount() {
        this.stopAutoRotate();
    }

    nextTestimonial() {
        this.setState(prevState => {
            if (prevState.testimonials.length === 0) return prevState;
            return {
                currentIndex: (prevState.currentIndex + 1) % prevState.testimonials.length
            };
        });
    }

    prevTestimonial() {
        this.setState(prevState => {
            if (prevState.testimonials.length === 0) return prevState;
            return {
                currentIndex: prevState.currentIndex === 0 
                    ? prevState.testimonials.length - 1 
                    : prevState.currentIndex - 1
            };
        });
    }

    goToTestimonial(index) {
        this.setState({ currentIndex: index }, () => {
            // Restart auto-rotation after manual navigation
            this.startAutoRotate();
        });
    }

    render() {
        // Get testimonials from props if state is empty (for initial render)
        const testimonials = this.state.testimonials.length > 0 
            ? this.state.testimonials 
            : (this.props.data?.testimonials || []);
        
        if (!this.props.data || !testimonials || testimonials.length === 0) {
            return null;
        }

        const currentIndex = this.state.currentIndex;

        return (
            <section id="testimonials" className="section testimonials-section">
                <div className="container">
                    <h2 className="section-title center"><span>Testimonials</span></h2>
                    <div 
                        className="testimonials-carousel-wrapper"
                        onMouseEnter={this.stopAutoRotate}
                        onMouseLeave={this.startAutoRotate}
                    >
                        <div className="testimonials-carousel">
                            <button 
                                className="carousel-button carousel-button-prev" 
                                onClick={() => {
                                    this.prevTestimonial();
                                    this.startAutoRotate();
                                }}
                                aria-label="Previous testimonial"
                            >
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            
                            <div className="testimonials-carousel-content">
                                <div 
                                    className="testimonials-carousel-track"
                                    style={{
                                        transform: `translateX(-${currentIndex * 100}%)`
                                    }}
                                >
                                    {testimonials.map((testimonial, index) => (
                                        <div 
                                            key={index} 
                                            className="testimonial-item carousel-slide"
                                        >
                                            <blockquote className="testimonial-quote">
                                                <p>"{testimonial.text}"</p>
                                                <cite>{testimonial.user}</cite>
                                            </blockquote>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button 
                                className="carousel-button carousel-button-next" 
                                onClick={() => {
                                    this.nextTestimonial();
                                    this.startAutoRotate();
                                }}
                                aria-label="Next testimonial"
                            >
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>

                        <div className="carousel-indicators">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => this.goToTestimonial(index)}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Testimonials;

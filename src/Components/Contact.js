import React, { Component } from 'react';

class Contact extends Component {
    render() {
        if(this.props.data){
            var name = this.props.data.name;
            var street = this.props.data.address.street;
            var city = this.props.data.address.city;
            var state = this.props.data.address.state;
            var zip = this.props.data.address.zip;
            var phone = this.props.data.phone;
            var email = this.props.data.email;
        }
        return (
            <section id="contact">
                <div className="row section-head">
                    <div className="two columns header-col">
                        <h1><span>Don't be a stranger. Get In Touch.</span></h1>
                        
                    </div>

                    <div className="ten columns">
                        <p className="lead">
                            Please contact me on my email id deepanshu.lulla[at]gmail.com or through Linkedin.
                        </p>

                    </div>
                </div>


            </section>
        );
    }
}

export default Contact;

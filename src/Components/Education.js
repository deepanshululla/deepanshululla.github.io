import React, { Component } from 'react';

class Education extends Component {
    render() {
        if (this.props.data) {
            var education = this.props.data.education.map(function (edu) {
                return <div key={edu.school} className="resume-item">
                    <div className="resume-header">
                        <h3>{edu.school}</h3>
                        <span className="date">{edu.graduated}</span>
                    </div>
                    <p className="info">{edu.degree}</p>
                    <p className="description">{edu.description}</p>
                </div>
            });
        }

        return (
            <section id="education" className="section resume-section">
                <div className="container">
                    <h2 className="section-title"><span>Education</span></h2>
                    <div className="resume-content">
                        {education}
                    </div>
                </div>
            </section>
        );
    }
}

export default Education;


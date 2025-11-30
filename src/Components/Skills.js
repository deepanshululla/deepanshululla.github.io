import React, { Component } from 'react';

class Skills extends Component {
    render() {
        if (this.props.data) {
            var skills = this.props.data.skills.map(function (skill) {
                return <li key={skill.name} className="skill-item">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-bar-wrapper">
                        <div className="skill-bar" style={{ width: skill.level }}></div>
                    </div>
                </li>
            });
        }

        return (
            <section id="skills" className="section resume-section">
                <div className="container">
                    <h2 className="section-title"><span>Skills</span></h2>
                    <div className="resume-content">
                        <p className="skills-intro">I specialize in architecting and building production-grade AI infrastructure platforms, scalable backend systems, and distributed services that power enterprise applications. My expertise spans LLM platforms, vector databases, MLOps, cloud-native infrastructure, and high-performance distributed systems.</p>
                        <ul className="skills-list">
                            {skills}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}

export default Skills;


import React, { Component } from 'react';

class Resume extends Component {
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

            var work = this.props.data.work.map(function (job) {
                return <div key={job.company} className="resume-item">
                    <div className="resume-header">
                        <h3>{job.company}</h3>
                        <span className="date">{job.years}</span>
                    </div>
                    <p className="info">{job.title}</p>
                    <div className="description">
                        {job.description.map((item, i) => <p key={i}>{item}</p>)}
                    </div>
                </div>
            });

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
            <section id="resume" className="section resume-section">
                <div className="container">
                    <div className="resume-block">
                        <h2 className="section-title"><span>Education</span></h2>
                        <div className="resume-content">
                            {education}
                        </div>
                    </div>

                    <div className="resume-block">
                        <h2 className="section-title"><span>Work</span></h2>
                        <div className="resume-content">
                            {work}
                        </div>
                    </div>

                    <div className="resume-block">
                        <h2 className="section-title"><span>Skills</span></h2>
                        <div className="resume-content">
                            <p className="skills-intro">I specialize in architecting and building production-grade AI infrastructure platforms, scalable backend systems, and distributed services that power enterprise applications. My expertise spans LLM platforms, vector databases, MLOps, cloud-native infrastructure, and high-performance distributed systems.</p>
                            <ul className="skills-list">
                                {skills}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Resume;

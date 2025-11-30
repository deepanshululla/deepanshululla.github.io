import React, { Component } from 'react';

class Skills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedGroups: new Set()
        };
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    toggleExpand(groupName) {
        this.setState(prevState => {
            const newExpanded = new Set(prevState.expandedGroups);
            if (newExpanded.has(groupName)) {
                newExpanded.delete(groupName);
            } else {
                newExpanded.add(groupName);
            }
            return { expandedGroups: newExpanded };
        });
    }

    calculateAverage(subSkills) {
        if (!subSkills || subSkills.length === 0) return "0%";
        const total = subSkills.reduce((sum, skill) => {
            const level = parseInt(skill.level);
            return sum + (isNaN(level) ? 0 : level);
        }, 0);
        const average = Math.round(total / subSkills.length);
        return `${average}%`;
    }

    render() {
        if (this.props.data) {
            const skillGroups = this.props.data.skills.map((skillGroup) => {
                const isExpanded = this.state.expandedGroups.has(skillGroup.group);
                const averageLevel = this.calculateAverage(skillGroup.subSkills);
                return (
                    <div key={skillGroup.group} className="skill-group">
                        <div 
                            className="skill-group-header clickable" 
                            onClick={() => this.toggleExpand(skillGroup.group)}
                        >
                            <span className="skill-group-name">{skillGroup.group}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div className="skill-group-bar-wrapper">
                                    <div className="skill-group-bar" style={{ width: averageLevel }}></div>
                                </div>
                                <i className={`fa fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}></i>
                            </div>
                        </div>
                        <ul className={`sub-skills-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
                            {skillGroup.subSkills.map((subSkill, index) => (
                                <li key={index} className="sub-skill-item">
                                    <span className="sub-skill-name">{subSkill.name}</span>
                                    <div className="skill-bar-wrapper">
                                        <div className="skill-bar" style={{ width: subSkill.level }}></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            });

            return (
                <section id="skills" className="section resume-section">
                    <div className="container">
                        <h2 className="section-title"><span>Skills</span></h2>
                        <div className="resume-content">
                            <p className="skills-intro">I specialize in architecting and building production-grade AI infrastructure platforms, scalable backend systems, and distributed services that power enterprise applications. My expertise spans LLM platforms, vector databases, MLOps, cloud-native infrastructure, and high-performance distributed systems.</p>
                            <div className="skills-groups">
                                {skillGroups}
                            </div>
                        </div>
                    </div>
                </section>
            );
        }
        return null;
    }
}

export default Skills;


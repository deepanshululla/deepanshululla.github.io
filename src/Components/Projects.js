import React, { Component } from 'react';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedItems: new Set()
        };
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    toggleExpand(projectId) {
        this.setState(prevState => {
            const newExpanded = new Set(prevState.expandedItems);
            if (newExpanded.has(projectId)) {
                newExpanded.delete(projectId);
            } else {
                newExpanded.add(projectId);
            }
            return { expandedItems: newExpanded };
        });
    }

    render() {
        if (this.props.data) {
            const projects = this.props.data.projects.map((project) => {
                const isExpanded = this.state.expandedItems.has(project.id);
                return (
                    <div key={project.id} className="resume-item">
                        <div 
                            className="resume-header clickable" 
                            onClick={() => this.toggleExpand(project.id)}
                        >
                            <h3>{project.title}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="date">{project.category}</span>
                                <i className={`fa fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}></i>
                            </div>
                        </div>
                        <div className={`description ${isExpanded ? 'expanded' : 'collapsed'}`}>
                            <p>{project.description}</p>
                            {project.tags && (
                                <div className="project-tags">
                                    <strong>Technologies: </strong>
                                    <span>{project.tags}</span>
                                </div>
                            )}
                            {project.url && project.url !== '#' && (
                                <div className="project-link" style={{ marginTop: 'var(--spacing-sm)' }}>
                                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn">
                                        View Project <i className="fa fa-external-link" style={{ marginLeft: '8px' }}></i>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                );
            });

            return (
                <section id="portfolio" className="section resume-section">
                    <div className="container">
                        <h2 className="section-title"><span>Projects</span></h2>
                        <div className="resume-content">
                            {projects}
                        </div>
                    </div>
                </section>
            );
        }
        return null;
    }
}

export default Projects;


import React, { Component } from 'react';

class Work extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedItems: new Set()
        };
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    toggleExpand(company) {
        this.setState(prevState => {
            const newExpanded = new Set(prevState.expandedItems);
            if (newExpanded.has(company)) {
                newExpanded.delete(company);
            } else {
                newExpanded.add(company);
            }
            return { expandedItems: newExpanded };
        });
    }

    render() {
        if (this.props.data) {
            const work = this.props.data.work.map((job) => {
                const isExpanded = this.state.expandedItems.has(job.company);
                return (
                    <div key={job.company} className="resume-item">
                        <div 
                            className="resume-header clickable" 
                            onClick={() => this.toggleExpand(job.company)}
                        >
                            <h3>{job.company}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="date">{job.years}</span>
                                <i className={`fa fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}></i>
                            </div>
                        </div>
                        <p className="info">{job.title}</p>
                        <div className={`description ${isExpanded ? 'expanded' : 'collapsed'}`}>
                            {job.description.map((item, i) => <p key={i}>{item}</p>)}
                        </div>
                    </div>
                );
            });

            return (
                <section id="work" className="section resume-section">
                    <div className="container">
                        <h2 className="section-title"><span>Work Experience</span></h2>
                        <div className="resume-content">
                            {work}
                        </div>
                    </div>
                </section>
            );
        }
        return null;
    }
}

export default Work;


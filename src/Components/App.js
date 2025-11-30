import React, {Component} from 'react';
import axios from 'axios'

import Header from './Header';
import About from './About';
import Education from './Education';
import Work from './Work';
import Skills from './Skills';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';
import {Footer} from './Footer';
import {resumeData} from "./resumeData";


export class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            resumeData:{}
        };
        this.getResumeData=this.getResumeData.bind(this);
    }

    getResumeData(){

       this.setState({resumeData: resumeData});


    }

    componentDidMount() {
        this.getResumeData();
    }

    render() {

        return(

            <div className="App">
                <Header data={this.state.resumeData.main} />
                <About data={this.state.resumeData.main} />
                <Education data={this.state.resumeData.resume} />
                <Work data={this.state.resumeData.resume} />
                <Skills data={this.state.resumeData.resume} />
                <Projects data={this.state.resumeData.portfolio} />
                <Testimonials data={this.state.resumeData.testimonials} />
                <Contact data={this.state.resumeData.main} />
                <Footer />
            </div>
        )
    }
}
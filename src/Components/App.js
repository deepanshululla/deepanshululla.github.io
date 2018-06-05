import React, {Component} from 'react';
import axios from 'axios'

import Header from './Header';
import About from './About';
import Resume from './Resume';
import {Portfolio2,Portfolio3} from './Portfolio';
import Testimonials from './Testimonials';
import Contact from './Contact';
import {Footer} from './Footer';
import {resumeData} from "./resumeData";

const URL='https://deepanshululla.github.io/react-portfolio2/resumeData.json'

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
                <Resume data={this.state.resumeData.resume} />
                <Portfolio2 data={this.state.resumeData.portfolio} />
                <Testimonials data={this.state.resumeData.testimonials} />
                <Contact data={this.state.resumeData.main} />
                <Footer />
            </div>
        )
    }
}
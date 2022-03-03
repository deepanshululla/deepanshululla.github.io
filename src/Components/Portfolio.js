import React, {Component } from 'react';
import Modal from 'react-modal';


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };


class ProjectOverlay extends Component {
    constructor() {
        super();
    
        this.state = {
          modalIsOpen: false
        };
    
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    
    afterOpenModal() {
    // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#f00';
    }

    closeModal() {
    this.setState({modalIsOpen: false});
    }

    render(){
        this.project = this.props.projectItem;
        return (
            <div>
                <p>This is awesome</p>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.props.afterOpenModal}
                    onRequestClose={this.props.closeModal}
                    style={customStyles}
                    >
                    <h5>{this.project.title}</h5>
                </Modal>
            </div>
        )
    }

}


/* <div className="overlay">
                        <div className="portfolio-item-meta">
                                <h5>{this.project.title}</h5>
                                <p>{this.project.category}</p>
                        </div>
                    </div> */


export class Portfolio extends Component{
    
    render() {
        if(this.props.data){
            var portfolio = this.props.data.projects.map((project,index)=>{
                let imageUrl = 'images/portfolio/'+project.image;
                return (
                <div className="columns portfolio-item" key={index}>
                    <div className="item-wrap" key={index}>
                        <a href={"#"+project.modal} title="" key={index} onClick={this.openModal}>
                            <img alt="" src={imageUrl} key={index}/>
                            <div>
                                <ProjectOverlay projectItem={project}/>
                            </div>
                            <div className="link-icon"><i className="icon-plus"></i></div>
                        </a>
                    </div>
                    
                </div>)
            });
        }
        return (
            <section id="portfolio">
                <div className="row">
                    <div className="twelve columns collapsed">
                        <h1>Check Out Some of My Projects.</h1>
                        <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                            {portfolio}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export class Portfolio3 extends Component{
    render() {
        if(this.props.data){
            var portfolio = this.props.data.projects.map((project,index)=>{
                let imageUrl = 'images/portfolio/'+project.image;
                return (
                <div className="columns portfolio-item" key={index}>
                    <div className="item-wrap" key={index}>
                        <a href={project.modal} title="" key={index}>
                            <img alt="" src={imageUrl} key={index}/>
                            <div className="overlay">
                                <div className="portfolio-item-meta" key={index}>
                                    <h5 key={index}>{project.title}</h5>
                                    <p key={index}>{project.category}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>)
            });
        }
        return (
            <section id="portfolio">
                <div className="row">
                    <div className="twelve columns collapsed">
                        <h1>Check Out Some of My Projects.</h1>
                        <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                            {portfolio}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}




export class Portfolio2 extends Component{
    render() {
        if(this.props.data){

            var portfolio=this.props.data.projects;
            var project0=portfolio[0];
            var project0Image='images/portfolio/'+project0.image;
            var project0ModalImage='images/portfolio/modals/'+project0.image;
            var project0ModalTag=project0.modal;
            var project0Modal="#"+project0.modal;
            var project0Title=project0.title;
            var project0Category=project0.category;
            var project0Description=project0.description;
            var project0Tags=project0.tags;
            var project0Url=project0.url;

            var project1=portfolio[1];
            var project1Image='images/portfolio/'+project1.image;
            var project1ModalImage='images/portfolio/modals/'+project1.image;
            var project1ModalTag=project1.modal;
            var project1Modal="#"+project1.modal;
            var project1Title=project1.title;
            var project1Category=project1.category;
            var project1Description=project1.description;
            var project1Tags=project1.tags;
            var project1Url=project1.url;


            var project2=portfolio[2];
            var project2Image='images/portfolio/'+project2.image;
            var project2ModalImage='images/portfolio/modals/'+project2.image;
            var project2ModalTag=project2.modal;
            var project2Modal="#"+project2.modal;
            var project2Title=project2.title;
            var project2Category=project2.category;
            var project2Description=project2.description;
            var project2Tags=project2.tags;
            var project2Url=project2.url;

            var project3=portfolio[3];
            var project3Image='images/portfolio/'+project3.image;
            var project3ModalImage='images/portfolio/modals/'+project3.image;
            var project3ModalTag=project3.modal;
            var project3Modal="#"+project3.modal;
            var project3Title=project3.title;
            var project3Category=project3.category;
            var project3Description=project3.description;
            var project3Tags=project3.tags;
            var project3Url=project3.url;

            var project4=portfolio[4];
            var project4Image='images/portfolio/'+project4.image;
            var project4ModalImage='images/portfolio/modals/'+project4.image;
            var project4ModalTag=project4.modal;
            var project4Modal="#"+project4.modal;
            var project4Title=project4.title;
            var project4Category=project4.category;
            var project4Description=project4.description;
            var project4Tags=project4.tags;
            var project4Url=project4.url;

            var project5=portfolio[5];
            var project5Image='images/portfolio/'+project5.image;
            var project5ModalImage='images/portfolio/modals/'+project5.image;
            var project5ModalTag=project5.modal;
            var project5Modal="#"+project5.modal;
            var project5Title=project5.title;
            var project5Category=project5.category;
            var project5Description=project5.description;
            var project5Tags=project5.tags;
            var project5Url=project5.url;

            var project6=portfolio[6];
            var project6Image='images/portfolio/'+project6.image;
            var project6ModalImage='images/portfolio/modals/'+project6.image;
            var project6ModalTag=project6.modal;
            var project6Modal="#"+project6.modal;
            var project6Title=project6.title;
            var project6Category=project6.category;
            var project6Description=project6.description;
            var project6Tags=project6.tags;
            var project6Url=project6.url;

            var project7=portfolio[7];
            var project7Image='images/portfolio/'+project7.image;
            var project7ModalImage='images/portfolio/modals/'+project7.image;
            var project7ModalTag=project7.modal;
            var project7Modal="#"+project7.modal;
            var project7Title=project7.title;
            var project7Category=project7.category;
            var project7Description=project7.description;
            var project7Tags=project7.tags;
            var project7Url=project7.url;





        }


        return (
            <section id="portfolio">

                <div className="row">

                    <div className="twelve columns collapsed">

                        <h1>Check Out Some of My Works.</h1>

                        <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                            <div className="columns portfolio-item">
                                <div className="item-wrap">

                                    <a href={project0Modal} title="">
                                        <img alt="" src={project0Image}/>
                                        <div className="overlay">
                                            <div className="portfolio-item-meta">
                                                <h5>{project0Title}</h5>
                                                <p>{project0Category}</p>
                                            </div>
                                        </div>
                                        <div className="link-icon"><i className="icon-plus"></i></div>
                                    </a>

                                </div>
                            </div>
                            <div className="columns portfolio-item">
                                <div className="item-wrap">

                                    <a href={project1Modal} title="">
                                        <img alt="" src={project1Image}/>
                                        <div className="overlay">
                                            <div className="portfolio-item-meta">
                                                <h5>{project1Title}</h5>
                                                <p>{project1Category}</p>
                                            </div>
                                        </div>
                                        <div className="link-icon"><i className="icon-plus"></i></div>
                                    </a>

                                </div>
                            </div>
                            <div className="columns portfolio-item">
                                <div className="item-wrap">

                                    <a href={project2Modal} title="">
                                        <img alt="" src={project2Image}/>
                                        <div className="overlay">
                                            <div className="portfolio-item-meta">
                                                <h5>{project2Title}</h5>
                                                <p>{project2Category}</p>
                                            </div>
                                        </div>
                                        <div className="link-icon"><i className="icon-plus"></i></div>
                                    </a>

                                </div>
                            </div>
                            <div className="columns portfolio-item">
                                <div className="item-wrap">

                                    <a href={project3Modal} title="">
                                        <img alt="" src={project3Image}/>
                                        <div className="overlay">
                                            <div className="portfolio-item-meta">
                                                <h5>{project3Title}</h5>
                                                <p>{project3Category}</p>
                                            </div>
                                        </div>
                                        <div className="link-icon"><i className="icon-plus"></i></div>
                                    </a>

                                </div>
                            </div>
                            <div className="columns portfolio-item">
                                <div className="item-wrap">

                                    <a href={project4Modal} title="">
                                        <img alt="" src={project4Image}/>
                                        <div className="overlay">
                                            <div className="portfolio-item-meta">
                                                <h5>{project4Title}</h5>
                                                <p>{project4Category}</p>
                                            </div>
                                        </div>
                                        <div className="link-icon"><i className="icon-plus"></i></div>
                                    </a>

                                </div>
                            </div>
                            <div className="columns portfolio-item">
                                <div className="item-wrap">

                                    <a href={project5Modal} title="">
                                        <img alt="" src={project5Image}/>
                                        <div className="overlay">
                                            <div className="portfolio-item-meta">
                                                <h5>{project5Title}</h5>
                                                <p>{project5Category}</p>
                                            </div>
                                        </div>
                                        <div className="link-icon"><i className="icon-plus"></i></div>
                                    </a>

                                </div>
                            </div>
                            <div className="columns portfolio-item">
                                <div className="item-wrap">

                                    <a href={project6Modal} title="">
                                        <img alt="" src={project6Image}/>
                                        <div className="overlay">
                                            <div className="portfolio-item-meta">
                                                <h5>{project6Title}</h5>
                                                <p>{project6Category}</p>
                                            </div>
                                        </div>
                                        <div className="link-icon"><i className="icon-plus"></i></div>
                                    </a>

                                </div>
                            </div>
                            <div className="columns portfolio-item">
                                <div className="item-wrap">

                                    <a href={project7Modal} title="">
                                        <img alt="" src={project7Image}/>
                                        <div className="overlay">
                                            <div className="portfolio-item-meta">
                                                <h5>{project7Title}</h5>
                                                <p>{project7Category}</p>
                                            </div>
                                        </div>
                                        <div className="link-icon"><i className="icon-plus"></i></div>
                                    </a>

                                </div>
                            </div>


                        </div>
                    </div>

                    <div id={project0ModalTag} className="popup-modal mfp-hide">

                        <img className="scale-with-grid" src={project0ModalImage} alt=""/>

                        <div className="description-box">
                            <h4>{project0Title}</h4>
                            <p>{project0Description}</p>
                            <span className="categories"><i className="fa fa-tag"></i>{project0Tags}</span>
                        </div>

                        <div className="link-box">
                            <a target="_blank" href={project0Url}>URL</a>
                            <a className="popup-modal-dismiss">Close</a>
                        </div>

                    </div>
                    <div id={project1ModalTag} className="popup-modal mfp-hide">

                        <img className="scale-with-grid" src={project1ModalImage} alt=""/>

                        <div className="description-box">
                            <h4>{project1Title}</h4>
                            <p>{project1Description}</p>
                            <span className="categories"><i className="fa fa-tag"></i>{project1Tags}</span>
                        </div>

                        <div className="link-box">
                            <a target="_blank" href={project1Url}>URL</a>
                            <a className="popup-modal-dismiss">Close</a>
                        </div>

                    </div>
                    <div id={project2ModalTag} className="popup-modal mfp-hide">

                        <img className="scale-with-grid" src={project2ModalImage} alt=""/>

                        <div className="description-box">
                            <h4>{project2Title}</h4>
                            <p>{project2Description}</p>
                            <span className="categories"><i className="fa fa-tag"></i>{project2Tags}</span>
                        </div>

                        <div className="link-box">
                            <a target="_blank" href={project2Url}>URL</a>
                            <a className="popup-modal-dismiss">Close</a>
                        </div>

                    </div>
                    <div id={project3ModalTag} className="popup-modal mfp-hide">

                        <img className="scale-with-grid" src={project3ModalImage} alt=""/>

                        <div className="description-box">
                            <h4>{project3Title}</h4>
                            <p>{project3Description}</p>
                            <span className="categories"><i className="fa fa-tag"></i>{project3Tags}</span>
                        </div>

                        <div className="link-box">
                            <a target="_blank" href={project3Url}>URL</a>
                            <a className="popup-modal-dismiss">Close</a>
                        </div>

                    </div>
                    <div id={project4ModalTag} className="popup-modal mfp-hide">

                        <img className="scale-with-grid" src={project4ModalImage} alt=""/>

                        <div className="description-box">
                            <h4>{project4Title}</h4>
                            <p>{project4Description}</p>
                            <span className="categories"><i className="fa fa-tag"></i>{project4Tags}</span>
                        </div>

                        <div className="link-box">
                            <a target="_blank" href={project4Url}>URL</a>
                            <a className="popup-modal-dismiss">Close</a>
                        </div>

                    </div>
                    <div id={project5ModalTag} className="popup-modal mfp-hide">

                        <img className="scale-with-grid" src={project5ModalImage} alt=""/>

                        <div className="description-box">
                            <h4>{project5Title}</h4>
                            <p>{project5Description}</p>
                            <span className="categories"><i className="fa fa-tag"></i>{project5Tags}</span>
                        </div>

                        <div className="link-box">
                            <a target="_blank" href={project5Url}>URL</a>
                            <a className="popup-modal-dismiss">Close</a>
                        </div>

                    </div>
                    <div id={project6ModalTag} className="popup-modal mfp-hide">

                        <img className="scale-with-grid" src={project6ModalImage} alt=""/>

                        <div className="description-box">
                            <h4>{project6Title}</h4>
                            <p>{project6Description}</p>
                            <span className="categories"><i className="fa fa-tag"></i>{project6Tags}</span>
                        </div>

                        <div className="link-box">
                            <a target="_blank" href={project6Url}>URL</a>
                            <a className="popup-modal-dismiss">Close</a>
                        </div>

                    </div>
                    <div id={project7ModalTag} className="popup-modal mfp-hide">

                        <img className="scale-with-grid" src={project7ModalImage} alt=""/>

                        <div className="description-box">
                            <h4>{project7Title}</h4>
                            <p>{project7Description}</p>
                            <span className="categories"><i className="fa fa-tag"></i>{project7Tags}</span>
                        </div>

                        <div className="link-box">
                            <a target="_blank" href={project7Url}>URL</a>
                            <a className="popup-modal-dismiss">Close</a>
                        </div>

                    </div>

                </div>
            </section>
        );
    }
}





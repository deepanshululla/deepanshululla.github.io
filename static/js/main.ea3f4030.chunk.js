(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e){e.exports={a:{main:{name:"Deepanshu Lulla",occupation:"Back End Developer",description:"My interests lie in creating and designing scalable,secure and fault resilient web systems",image:"profilepic.jpg",bio:"Deepanshu Lulla is a software engineer whoose interests lie in developing and maintaining large scale systems. His alma mater include Northeastern University, Boston, MA, USA and National Institute of technology,Bhopal,MP, India both premier and recognized institutes in their respective countries.He wishes to solve challenging problems of developing systems that really scale while ensuring they do not compromise in security aspects.He believes both scalability and security aren't someting that can be added later but need to be integrated in initial system design and requirements process.",email:"deepanshu.lulla@gmail.com",phone:"857-452-0190",address:{street:"",city:"New York City",state:"NY",zip:"10010"},website:"http://deepanshululla.com",resumedownload:"https://www.dropbox.com/s/yrnbqa4hfts2q0y/Deepanshu%20Lulla%20software%20engineer.pdf?dl=0",social:[{name:"linkedin",url:"http://linkedin.com/in/deepanshululla",className:"fa fa-linkedin"},{name:"github",url:"http://github.com/deepanshululla",className:"fa fa-github"}]},resume:{education:[{school:"Northeastern University,Boston,MA",degree:"Masters(Computer Networking)",graduated:"September 2017",description:"Relevent courses: Computer networks, Network security, Cloud computing, Algorithms"},{school:"MANIT(NIT Bhopal), India",degree:"Bachelors(Electronics and Communication)",graduated:"May 2014",description:"Had 3 IEEE publication during undergrad level primarily focussed on Embedded systems and robotics"}],work:[{company:"Oracle Corp.",title:"Senior Software Developer",years:"Dec 2018 - Present",description:["Tech Stack: Python3, Celery, RabbitMQ, Postgres, Elasticsearch, Kubernetes, Prometheus, Grafana, helm, jenkins.","- Implemented pipeline retry logic to automatically retry hanging or failed jobs hence decreasing downtime by 300%.","- Developed API views for viewing the current status of ETL jobs and exposing them over rest API. ","- Wrote custom Prometheus exporter to expose application pipeline metrics to monitor exceptions,latency of API and overall runtime of jobs.","- Added monitoring and alerting to the application by exporting metrics using Prometheus, Elasticsearch and using Grafana to create dashboards. Created alerts by using pagerduty and implemented logic for automatic healing of the pipeline.","- Performed load testing on the application, discovering the bottlenecks and hence scaling the application to accommodate 200% increase in load while increasing speed by over 75%.","- Created end-to-end black-box testing framework in python for testing the backend rest API and integrated it with Jenkins and Kubernetes pipeline for CI/CD. Handed it off to QA for test cases development.","- Use Test Driven Development and other clean code best practices to ensure code quality always remains high and always pertain to business requirements."]},{company:"Akamai Technologies Inc.",title:"Software Engineer",years:"Oct 2017 - Nov 2018",description:["- Designed and developed a monitoring platform using Python Flask, Influxdb, React to display the aggregate analysis of time series data.","- Customized Open source monitoring tools like Telegraf, Grafana using Golang to meet the product\u2019s monitoring requirements decreasing troubleshooting time during incidents by more than 50%.","- CCM(Customer Cluster Mapper): Created REST API using Python Flask, Celery, Redis as well as a dashboard using REACT to map different customers to their respective clusters on AWS Opsworks."]},{company:"Dell EMC",title:"Software Engineer Intern",years:"May 2016 - December 2016",description:["Setup infrastructure for Active directory using VMWare ESXI. Worked on Storage protocols such as SAN, NFS, ISCSI "]}],skills:[{name:"Back end development",level:"70%"},{name:"Front end development",level:"50%"},{name:"Machine learning",level:"30%"},{name:"Computer networking and security",level:"70%"},{name:"Cloud Services(Amazon Web services)",level:"60%"},{name:"Containerization(Docker,Kubernetes)",level:"60%"},{name:"Python",level:"80%"},{name:"Javascript",level:"60%"},{name:"React",level:"60%"},{name:"Flask",level:"60%"},{name:"Linux",level:"60%"},{name:"Relational Databases(MySql,Postgres)",level:"70%"},{name:"Non Relational Databases(Redis,Mongodb,Cassandra)",level:"60%"},{name:"Java",level:"70%"},{name:"Go",level:"50%"},{name:"Nodejs",level:"50%"},{name:"Spring Boot",level:"40%"}]},portfolio:{projects:[{id:1,title:"Yelp Clone (Large social media application) using nodejs, mongodb,bootstrap",description:"Created a large restful social media application with user registration,login and logout using passport js where users can have complete CRUD abilities of campgrounds posts and comments created by them.Implemented dynamic pricing for campgrounds and proper authentication and authorization by appropriate middleware. Added functionality to search through campgrounds and for resetting password.Used mongodb for backend database as well as bootstrap for styling. Added support for viewing campgrounds location using google maps.",category:"Web Development",tags:"Social media, Web Development, NodeJS, Mongodb",image:"yelp.png",url:"https://evening-basin-24316.herokuapp.com",modal:"modal-01"},{id:2,title:"Airline E-Commerce website using Java Spring boot, MYSQL, AngularJS and thymeleaf",description:"Created a website clone for an Ecommerce airline web application using Spring boot, Spring data JPA(ORM) and MySQL. Added features to search and book flights.Created an REST API to serve an an integration layer for flight checkin microservice. Created the same microservice for passengers to check in.Encoded passwords to prevent them from being stored in plain text and defined roles for different types of users to perform authentication and authrorization.Added logging features and defined custom log rotation policies to log information to an external log file.Used AngularJs for form validations and two way binding",category:"Web Development",tags:"Web Development, Java, Spring-boot, Mysql, AngularJs",image:"flight.jpg",url:"https://github.com/deepanshululla/flight-reservation",modal:"modal-02"},{id:3,title:"Implementing Secure File Transfer Protocols in C with OPENSSL",description:"Created self-signed RSA public/private keypair and used them to perform authenticated key agreement using Diffie-Hellman.Computed keys for HMAC(with SHA1 hash) and a shared secret key and IV for AES 256 bit CBC encryption using the exchanged secret.Performed file transfer over TCP sockets by three methods Encrypt and MAC (SSH style), Encrypt then MAC(IPSec-style) and MAC then Encrypt(TLS style).",category:"Network Security",tags:"Network programming, Security",image:"openssl.jpg",url:"https://github.com/deepanshululla/Network-security/tree/master/Secure%20File%20Transfer%20protocol%20in%20C",modal:"modal-03"},{id:4,title:"REST API for E-Commerce Store on Docker containers",description:"Created a REST API with python flask and SQLALCHEMY as ORM using MySQL as the backend.Used docker compose for orchestrating python and MariaDB containers.Increased security by using JWT tokens for user authentication and authorization for specific requests.Used Postman for system testing and documenting the functionality of the REST API.Created unit,integration and system tests as well as makefile for test automation",category:"Web Development",tags:"REST API, Web Development, Backend Programming, Python, Flask, Mysql",image:"restapi.jpg",url:"https://github.com/deepanshululla/stores_rest_api_flask",modal:"modal-04"},{id:5,title:"Network Programability as a Cloud Service(Research project)",description:"End Result: Successful Open Source Implementation of HAAS based scenario using Network Virtualisation and Software Defined Networking with multi tenant multi hardware provider scenario in collaboration with Cisco and Massachusetts Open Cloud (MOC) (Agile SDLC)Created Network Topologies and spawn instances in OpenStack to simulate the network environment.Improved the existing HaaS scenario by using a network virtualization layer (OpenVirtex) between controllers and OpenVSwitches to provide scale up and down across multiple hardware domains to tenants (IaaS providers).Created a mechanism based on Client-Server Model to synchronize NOSQL(Mongodb) database of different Hardware Domains.",category:"Network Programming",tags:"Opensource,Openvirtex,Software Defined Networks, Network virtualization",image:"ovx.png",url:"https://github.com/BU-NU-CLOUD-SP16/Network-Programmability-as-a-Service",modal:"modal-05"},{id:6,title:"Jenkins CI/CD Automation with Docker on AWS",description:"Deployed Jenkins cluster installation on Docker containers with Docker running inside containers on AWS and created Job-DSLs for creating freestyle projects for testing Nodejs. Java Spring & Scala applications.Developed Jenkins scripted pipelines using Groovy to create an automated CI/CD pipeline by integrating plugins such as Github, Gradle, npm, Email integrations, Slack, Bitbucket, Jfrog artifactory, Blue ocean, Docker hub, Sonarcube etc.",category:"CI/CD",tags:"Jenkins, CI/CD, Docker",image:"jenkins.png",url:"https://github.com/deepanshululla/jenkinsAutomation",modal:"modal-06"},{id:7,title:"Blog Application using Python Flask, Docker-Compose,AWS, HTML,CSS, Javascript. (web development)",description:"Created Blog Application using Python with authentication & authorization (Author login/logout) functionality as well as different page views for authors and readers using MYSQL as the database and Flask SQL Alchemy as ORM tool.\n Used docker for creating MySQL and application backend containers and docker-compose for orchestration.\n Created an isolated network for the Docker containers. The app was tested and deployed on AWS. Used NGINX for configuring HTTPS(SSL).Applied Jinja2 templating to support interaction between front and back end and to make front end more modular.Implemented front end using HTML, CSS, Bootstrap, Javascript.",category:"Web Development",tags:"Web Development, Python, Flask, MYSql",image:"blog.jpg",url:"https://github.com/deepanshululla/flask_blog_mysql",modal:"modal-07"},{id:8,title:"IMDB Clone Application using Nodejs, Express",description:"Created a Movie search Application backend using Nodejs and express that searches for movies using OMDB REST API and displays them on a page.Constructed a front end using HTML, CSS, Bootstrap.Added movie page to see the information about each movie such as cast, IMDB rating etc.",category:"Web Development",tags:"Web Development, Javascript",image:"imdb.jpg",url:"https://imdb-clone-nodejs.herokuapp.com",modal:"modal-08"}]},testimonials:{testimonials:[{text:"Deepanshu worked for me as a COOP at DELL EMC in 2016. He is a very quick and enthusiastic learner and very easy to work with. In a very short time, he was able to learn storage technology and was a valuable contributor to the team. He also learned VMware and setup the ESX server on his own. He reached out to team members when he needed help and worked well to adapt to changes. He worked on multiple projects and delivered on time. He will be an asset to any team and I will hire him in a minute if I had the chance!",user:"Ms. Aparna Ramasundar(Manager at Dell EMC)"}]}}}},17:function(e,a,t){e.exports=t(43)},23:function(e,a,t){},43:function(e,a,t){"use strict";t.r(a);var n=t(0),o=t.n(n),r=t(15),s=t.n(r),i=(t(23),t(1)),l=t(2),c=t(5),m=t(3),d=t(7),u=t(4),p=(t(24),function(e){function a(){return Object(i.a)(this,a),Object(c.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(l.a)(a,[{key:"render",value:function(){if(this.props.data)var e=this.props.data.name,a=this.props.data.occupation,t=this.props.data.description,n=this.props.data.address.city,r=this.props.data.social.map(function(e){return o.a.createElement("li",{key:e.name},o.a.createElement("a",{target:"_blank",href:e.url},o.a.createElement("i",{className:e.className})))});return o.a.createElement("header",{id:"home"},o.a.createElement("nav",{id:"nav-wrap"},o.a.createElement("a",{className:"mobile-btn",href:"#nav-wrap",title:"Show navigation"},"Show navigation"),o.a.createElement("a",{className:"mobile-btn",href:"#",title:"Hide navigation"},"Hide navigation"),o.a.createElement("ul",{id:"nav",className:"nav"},o.a.createElement("li",{className:"current"},o.a.createElement("a",{className:"smoothscroll",href:"#home"},"Home")),o.a.createElement("li",null,o.a.createElement("a",{className:"smoothscroll",href:"#about"},"About")),o.a.createElement("li",null,o.a.createElement("a",{className:"smoothscroll",href:"#resume"},"Resume")),o.a.createElement("li",null,o.a.createElement("a",{className:"smoothscroll",href:"#portfolio"},"Projects")),o.a.createElement("li",null,o.a.createElement("a",{className:"smoothscroll",href:"#testimonials"},"Testimonials")),o.a.createElement("li",null,o.a.createElement("a",{className:"smoothscroll",href:"#contact"},"Contact")),o.a.createElement("li",null,o.a.createElement("a",{target:"_blank",href:"https://codingbrewery.com/"},"Blog")))),o.a.createElement("div",{className:"row banner"},o.a.createElement("div",{className:"banner-text"},o.a.createElement("h1",{className:"responsive-headline"},e),o.a.createElement("h3",null,"I am a ",n," based ",o.a.createElement("span",null,a),". ",t),o.a.createElement("hr",null),o.a.createElement("ul",{className:"social"},r))),o.a.createElement("p",{className:"scrolldown"},o.a.createElement("a",{className:"smoothscroll",href:"#about"},o.a.createElement("i",{className:"icon-down-circle"}))))}}]),a}(n.Component)),h=function(e){function a(){return Object(i.a)(this,a),Object(c.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(l.a)(a,[{key:"render",value:function(){if(this.props.data)var e=this.props.data.name,a="images/"+this.props.data.image,t=this.props.data.bio,n=this.props.data.address.street,r=this.props.data.address.city,s=this.props.data.address.state,i=this.props.data.address.zip,l=this.props.data.phone,c=this.props.data.email,m=this.props.data.resumedownload;return o.a.createElement("section",{id:"about"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"three columns"},o.a.createElement("img",{className:"profile-pic",src:a,alt:""})),o.a.createElement("div",{className:"nine columns main-col"},o.a.createElement("h2",null,"About Me"),o.a.createElement("p",null,t),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"columns contact-details"},o.a.createElement("h2",null,"Contact Details"),o.a.createElement("p",{className:"address"},o.a.createElement("span",null,e),o.a.createElement("br",null),o.a.createElement("span",null,n,o.a.createElement("br",null),r,", ",s," ",i),o.a.createElement("br",null),o.a.createElement("span",null,l),o.a.createElement("br",null),o.a.createElement("span",null,c))),o.a.createElement("div",{className:"columns download"},o.a.createElement("p",null,o.a.createElement("a",{href:m,className:"button"},o.a.createElement("i",{className:"fa fa-download"}),"Download Resume")))))))}}]),a}(n.Component),g=function(e){function a(){return Object(i.a)(this,a),Object(c.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(l.a)(a,[{key:"render",value:function(){if(this.props.data)var e=this.props.data.education.map(function(e){return o.a.createElement("div",{key:e.school,className:"row item"},o.a.createElement("div",{className:"twelve columns"},o.a.createElement("h3",null,e.school),o.a.createElement("p",{className:"info"},e.degree," ",o.a.createElement("span",null,"\u2022")," ",o.a.createElement("em",{className:"date"},e.graduated)),o.a.createElement("p",null,e.description)))}),a=this.props.data.work.map(function(e){return o.a.createElement("div",{key:e.company,className:"row item"},o.a.createElement("div",{className:"twelve columns"},o.a.createElement("h3",null,e.company),o.a.createElement("p",{className:"info"},e.title,o.a.createElement("span",null,"\u2022")," ",o.a.createElement("em",{className:"date"},e.years)),o.a.createElement("p",null,e.description.map(function(e){return o.a.createElement("p",null,e)}))))}),t=this.props.data.skills.map(function(e){var a="bar-expand "+e.name.toLowerCase();return o.a.createElement("li",{key:e.name},o.a.createElement("span",{style:{width:e.level},className:a}),o.a.createElement("em",null,e.name))});return o.a.createElement("section",{id:"resume"},o.a.createElement("div",{className:"row education"},o.a.createElement("div",{className:"three columns header-col"},o.a.createElement("h1",null,o.a.createElement("span",null,"Education"))),o.a.createElement("div",{className:"nine columns main-col"},e)),o.a.createElement("div",{className:"row work"},o.a.createElement("div",{className:"three columns header-col"},o.a.createElement("h1",null,o.a.createElement("span",null,"Work"))),o.a.createElement("div",{className:"nine columns main-col"},a)),o.a.createElement("div",{className:"row skill"},o.a.createElement("div",{className:"three columns header-col"},o.a.createElement("h1",null,o.a.createElement("span",null,"Skills"))),o.a.createElement("div",{className:"nine columns main-col"},o.a.createElement("p",null,"My specialization exists in designing and creating full stack scalable secure solutions for the business needs."),o.a.createElement("div",{className:"bars"},o.a.createElement("ul",{className:"skills"},t)))))}}]),a}(n.Component),f=function(e){function a(){return Object(i.a)(this,a),Object(c.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(l.a)(a,[{key:"render",value:function(){var e=this.props.projectItem;return console.log(this.props),o.a.createElement("div",{className:"portfolio-item-meta"},o.a.createElement("h5",null,e.title),o.a.createElement("p",null,e.category))}}]),a}(n.Component),b=function(e){function a(){return Object(i.a)(this,a),Object(c.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(l.a)(a,[{key:"render",value:function(){if(this.props.data)var e=this.props.data.projects.map(function(e,a){var t="images/portfolio/"+e.image;return o.a.createElement("div",{className:"columns portfolio-item",key:a},o.a.createElement("div",{className:"item-wrap",key:a},o.a.createElement("a",{href:e.modal,title:"",key:a},o.a.createElement("img",{alt:"",src:t,key:a}),o.a.createElement("div",{className:"overlay"},o.a.createElement(f,{projectItem:e})),o.a.createElement("div",{className:"link-icon"},o.a.createElement("i",{className:"icon-plus"})))))});return o.a.createElement("section",{id:"portfolio"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"twelve columns collapsed"},o.a.createElement("h1",null,"Check Out Some of My Projects."),o.a.createElement("div",{id:"portfolio-wrapper",className:"bgrid-quarters s-bgrid-thirds cf"},e))))}}]),a}(n.Component),v=(n.Component,n.Component,function(e){function a(){return Object(i.a)(this,a),Object(c.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(l.a)(a,[{key:"render",value:function(){if(this.props.data)var e=this.props.data.testimonials.map(function(e,a){return o.a.createElement("li",null,o.a.createElement("blockquote",null,o.a.createElement("p",null,e.text),o.a.createElement("cite",null,e.user)))});return o.a.createElement("section",{id:"testimonials"},o.a.createElement("div",{className:"text-container"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"two columns header-col"},o.a.createElement("h1",null,o.a.createElement("span",null,"Testimonials"))),o.a.createElement("div",{className:"ten columns flex-container"},o.a.createElement("ul",{className:"slides"},e)))))}}]),a}(n.Component)),E=function(e){function a(){return Object(i.a)(this,a),Object(c.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(l.a)(a,[{key:"render",value:function(){if(this.props.data)this.props.data.name,this.props.data.address.street,this.props.data.address.city,this.props.data.address.state,this.props.data.address.zip,this.props.data.phone,this.props.data.email;return o.a.createElement("section",{id:"contact"},o.a.createElement("div",{className:"row section-head"},o.a.createElement("div",{className:"two columns header-col"},o.a.createElement("h1",null,o.a.createElement("span",null,"Don't be a stranger. Get In Touch."))),o.a.createElement("div",{className:"ten columns"},o.a.createElement("p",{className:"lead"},"Please contact me on my email id deepanshu.lulla[at]gmail.com or through Linkedin."))))}}]),a}(n.Component),y=function(){return o.a.createElement("div",null,o.a.createElement("footer",null,o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"twelve columns"},o.a.createElement("ul",{className:"social-links"},o.a.createElement("li",null,o.a.createElement("a",{target:"_blank",href:"https://www.linkedin.com/in/deepanshululla"},o.a.createElement("i",{className:"fa fa-linkedin"}))),o.a.createElement("li",null,o.a.createElement("a",{target:"_blank",href:"https://www.github.com/deepanshululla"},o.a.createElement("i",{className:"fa fa-github"}))))),o.a.createElement("div",{id:"go-top"},o.a.createElement("a",{className:"smoothscroll",title:"Back to Top",href:"#home"},o.a.createElement("i",{className:"icon-up-open"}))))))},w=t(16),k=function(e){function a(e){var t;return Object(i.a)(this,a),(t=Object(c.a)(this,Object(m.a)(a).call(this,e))).state={resumeData:{}},t.getResumeData=t.getResumeData.bind(Object(d.a)(t)),t}return Object(u.a)(a,e),Object(l.a)(a,[{key:"getResumeData",value:function(){this.setState({resumeData:w.a})}},{key:"componentDidMount",value:function(){this.getResumeData()}},{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement(p,{data:this.state.resumeData.main}),o.a.createElement(h,{data:this.state.resumeData.main}),o.a.createElement(g,{data:this.state.resumeData.resume}),o.a.createElement(b,{data:this.state.resumeData.portfolio}),o.a.createElement(v,{data:this.state.resumeData.testimonials}),o.a.createElement(E,{data:this.state.resumeData.main}),o.a.createElement(y,null))}}]),a}(n.Component),N=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function S(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var a=e.installing;a.onstatechange=function(){"installed"===a.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}s.a.render(o.a.createElement(k,null),document.getElementById("react-container")),function(){if("serviceWorker"in navigator){if(new URL("",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("","/service-worker.js");N?(function(e){fetch(e).then(function(a){404===a.status||-1===a.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):S(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ")})):S(e)})}}()}},[[17,1,2]]]);
//# sourceMappingURL=main.ea3f4030.chunk.js.map
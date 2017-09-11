var projectImages=document.querySelectorAll(".project-images");
var projectPara=document.querySelector(".projects")
var projectTitleDescriptor=document.querySelector("#project-title-descriptor");
var clickMessageOn=true;

var pr1Name=document.querySelector("#pr1Name");
var pr2Name=document.querySelector("#pr2Name");
var pr3Name=document.querySelector("#pr3Name");
var pr4Name=document.querySelector("#pr4Name");
var pr5Name=document.querySelector("#pr5Name");

var pr1Description=document.querySelector("#pr1Description");
var pr2Description=document.querySelector("#pr2Description");
var pr3Description=document.querySelector("#pr3Description");
var pr4Description=document.querySelector("#pr4Description");
var pr5Description=document.querySelector("#pr5Description");





var projectsObject={
    "devops":[
            {
                "projectName": "Continuous Deployment using Docker, Git, Python flask, Bash, Nginx, Cadvisor, AWS EC2",
                "projectDescription":"• Created a CD workflow by automated building of docker images using"+
                 " git post-receive hooks (bash) and docker compose.\n"+"• Scripted automated configuration"+
                " for setting up staging server and production server on AWS reducing deployment time by more than 50%.\n"+
                "• Configured SSL certificates for application to use with Nginx. Added self-healing features (using systemd units) and Cadvisor for monitoring.",
                "github-link":"https://www.github.com/deepanshululla"
            },
            {"projectName":"Jenkins CI/CD Automation for Nodejs,Java web applications with Docker on AWS",
            "projectDescription":
                        " • Deployed Jenkins cluster installation on Docker containers with Docker running" + 
                        "inside containers on AWS.\n • Created Job-DSLs for creating freestyle projects for testing Nodejs, " +
                         "Java Spring & Scala applications. \n • Developed Jenkins scripted pipelines using Groovy to create an" + 
                        " automated CI/CD pipeline by integrating plugins such as Github, Gradle, npm, Email integrations," +
                        " Slack, Bitbucket,  Jfrog artifactory, Blue ocean, Docker hub, Sonarcube etc",
            "github-link":"https://www.github.com/deepanshululla/jenkinsAutomation"},
            
            {"projectName":"Continuous Delivery via Zero downtime Deployment of Rolling-updates through Ansible, Nginx, HAproxy, github",
            "projectDescription":"• Created ansible playbooks based on roles and templates to install and configure web servers(Nginx)"+ 
            " and load balancers(HA proxy)\n"+ 
            "• Successfully added feature to deploy rolling updates based on GitHub code while ensuring website's uptime be 100%.",
            "github-link":"https://github.com/deepanshululla/Deploying-Rolling-updates-through-Ansible-Nginx-HAPROXY"
            },

    ],
    "security":[
            {"projectName":"Attacks on Social Networks(Web Security)",
            "projectDescription":"End Result: Successful implementation of Web-based attacks(attacks on websites and browsers)\n"+
            "• Implemented Cross Site Request Forgery(CSRF) attack by using GET and POST requests.\n"+
            "• Implemented Reflected Cross-site Scripting(XSS) attacks in Javascript to steal cookies"+
            " using C programming and hijack session using a Java program. \n"+
            "• Created a script in AJAX for a self-propagating worm to implement Stored XSS attack.",
            "github-link":"https://github.com/deepanshululla/Network-security"},

             {
                "projectName":"Implementing Secure File Transfer Protocols in C with OPENSSL",
                "projectDescription":"• Created self-signed RSA public/private keypair and used them to perform" +
                " authenticated key agreement using Diffie-Hellman.\n • Computed keys for HMAC(with SHA1 hash) and a shared secret" +
                " key and IV for AES 256 bit CBC encryption using the exchanged secret.\n • Performed file transfer over TCP sockets"+
                " by three methods Encrypt and MAC (SSH style), Encrypt then MAC(IPSec-style) and MAC then Encrypt(TLS style).",
            "github-link":"https://github.com/deepanshululla/Network-security"},

             {"projectName":"Attacking TCP/IP Protocols using python scapy",
            "projectDescription":"End Result: The End Result was to learn how to do Denial of Service(DOS) and Man"+
            " in the Middle attacks in the current implementations of TCP/IP protocol.\n • Implemented exploits to attack"+
            " various TCP/IP stack protocols under Ubuntu using Netwox (with C) and scapy (with python).\n"+
            "•  The list of attacks includes ARP cache poisoning(MITM,DOS), ICMP Redirect Attack(MITM), SYN Flooding Attack(DOS),"+
            " TCP RST Attacks on telnet and SSH Connections(DOS), TCP RST Attacks on Video Streaming Applications(DOS), ICMP Blind" +
            " Connection-Reset, and Source-Quench Attacks(Didn't work,DOS), and TCP Session Hijacking(MITM,DOS) \n"+
            "•  Analyzed packets in wire shark to determine why certain attacks were not successful in this OS.Also Scrutinized"+
            " initial sequence number generator and source port selection algorithm",
            "github-link":"https://github.com/deepanshululla/Network-security"},
    ],
    "networks":[
            {"projectName":"Content Delivery Network (CDN)",
            "projectDescription":"• Implemented a DNS server that uses the redirection technique to send clients to the best replica servers depending on the fastest response time.\n"+
            "• Implemented HTTP server that hosts on the Amazon EC2 sites (replica servers) to return the content requested by the client either from its cache or by fetching it from the origin server.\n"+ 
            "• Implemented cache replacement strategy to remove the content which is less requested by the clients and replace it with most requested.",
            "github-link":"https://github.com/deepanshululla/Network-Programming-and-Scripting"},

             {"projectName":"Network Programability as a Cloud Service(Research project)",
                "projectDescription":"End Result: Successful Open Source Implementation of HAAS based scenario using Network Virtualization"+
                                    " and Software Defined Networking with multi tenant multi hardware provider scenario in collaboration with Cisco"+ 
                                    " and Massachusetts Open Cloud (MOC) (Agile SDLC)\n"+
                                    "• Created Network Topologies and spawned instances in OpenStack to simulate the network environment.\n"+
                                    "• Improved the existing HaaS scenario by using a network virtualization layer (OpenVirtex) between"+
                                    " controllers and OpenVSwitches to provide scale up and down across multiple hardware domains to tenants (IaaS providers).\n"+
                                    "• Created a mechanism based on Client-Server Model to synchronize NOSQL(Mongodb) database of different Hardware Domains.",
            "github-link":"https://github.com/deepanshululla/Network-Programmability-as-a-Service"},

             {"projectName":"Multi threaded Web Crawler using python",
            "projectDescription":"End Result: Web Crawler is used to extract information from different websites by crawling through all its web pages.\n"+
                                "• Successfully developed a client process in python to crawl over 20k pages and find 5 secret flags located at various locations.\n"+
                                "• Used sockets to send program generated application layer headers.\n"+
                                "• Handled various aspects of HTTP like session handling, cookie management and HTTP response code handling",
            "github-link":"https://github.com/deepanshululla/Network-Programming-and-Scripting"},

    ],
    "webdev":[
        {
            "projectName":"REST API for E-Commerce Store on Docker containers",
            "projectDescription": "• Created a REST API with python flask and SQLALCHEMY as ORM using MySQL as the backend.\n"+
                                "• Used docker compose for orchestrating python and MariaDB containers.\n"+
                                "• Increased security by using JWT tokens for user authentication and authorization for specific requests.\n"+
                                "• Used Postman for testing and documenting the functionality of the REST API.",
            "github-link":"https://github.com/deepanshululla/stores_rest_api_flask"
        },
        {   
            "projectName":"Blog Application using Python Flask, Docker-Compose,AWS, HTML,CSS, Javascript.",
            "projectDescription": "•    Created Blog Application using Python with authentication & authorization (Author login/logout)"+ 
                                    "functionality as well as different page views for authors and readers using MYSQL as the database and Flask SQL Alchemy as ORM tool.\n"+ 
                                "• Used docker for creating MySQL and application backend containers and docker-compose for orchestration. Created an isolated network for the Docker containers. The app was tested and deployed on AWS. Used NGINX for configuring HTTPS(SSL).\n"+ 
                                "• Applied Jinja2 templating to support interaction between front and back end and to make front end more modular.Implemented front end using HTML, CSS, Bootstrap, Javascript.",
            "github-link":"https://github.com/deepanshululla/flask_blog"

        },
        {   
            "projectName":"Front End Web Applications.",
            "projectDescription": "• Created patatap SPA Application using Javascript along with howler.js and paper.js\n"+ 
                                    "• Created a todo-list SPA application\n"+ 
                                "• Created a RGB color guessing game based on different RGB values",
            "github-link":"https://github.com/deepanshululla/front-end-web-dev"

        }

    ]

}


for(var i=0;i<projectImages.length;i++){
    projectImages[i].addEventListener("click", function(){
        var imgType=this.id;
        
        if (projectPara.style.display === 'none') {
            projectPara.style.display = 'block';
            scrollBy(0, window.innerHeight);
            // emptyContents();
            // projectPara.textContent=proj
        } else {
            projectPara.style.display = 'none';
            scrollBy(0, window.innerHeight);
            displayProjectPara(imgType);
            
            
        }

    });
}

function emptyContents() {
    projectTitleDescriptor.textContent="Click on images to see details..";
    clickMessageOn=true;
    pr1Name.textContent="";
    pr2Name.textContent="";
    pr3Name.textContent="";
    pr4Name.textContent="";
    pr5Name.textContent="";
    pr1Link.text="";
    pr2Link.text="";
    pr3Link.text="";
    pr4Link.text="";
    pr5Link.text="";
    pr1Description.textContent="";
    pr2Description.textContent="";
    pr3Description.textContent="";
    pr4Description.textContent="";
    pr5Description.textContent="";

}

function displayText(projectsList){
    projectTitleDescriptor.textContent="Scroll down to see the list";
    var num=Math.min(projectsList.length,5);
    for(var i=0;i<num;i++){
                prNameTag="#pr"+(i+1)+"Name";
                prLinkTag="#pr"+(i+1)+"Link";
                prDescriptionTag="#pr"+(i+1)+"Description";
                var nameTag=document.querySelector(prNameTag);
                var linkTag=document.querySelector(prLinkTag);
                var descriptionTag=document.querySelector(prDescriptionTag);

                nameTag.textContent=projectsList[i]["projectName"];
                nameTag.classList.add("project-name-tag");
                linkTag.setAttribute("href", projectsList[i]["github-link"]);
                linkTag.text="Visit Project";
                linkTag.classList.add("project-link");
                descriptionTag.textContent=projectsList[i]["projectDescription"];
    }
}


function displayProjectPara(imgType){
   
    if (imgType==="devops-image"){
            var projectsList=projectsObject["devops"];
            displayText(projectsList);
            clickMessageOn=false;
    }
    else if (imgType==="security-image"){
            var projectsList=projectsObject["security"];
            displayText(projectsList);
            clickMessageOn=false;
    }
        
    
    else if (imgType==="network-image"){
            var projectsList=projectsObject["networks"];
            displayText(projectsList);
            clickMessageOn=false;
    }
    else if (imgType==="webdev-image"){
       
            var projectsList=projectsObject["webdev"];   
            displayText(projectsList);
            clickMessageOn=false;
    }
       

 
}

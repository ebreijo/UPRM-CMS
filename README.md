UPRM-CMS
========

## Description

UPRM Career Management System (UPRM-CMS) is a web application designed to provide an enhanced experience for companies, students, and the Placement Office employees. This content management system provides to companies the ability to create and edit their company profiles, post job offers, and the capability of adding extra data and request on campus services. In addition, administrators will be able to manage the content that is displayed on the web application.

## Prerequisites

* Git - Download and Install [Git](https://git-scm.com/downloads).
* Node.js - Download and Install [Node.js](https://nodejs.org/en/download/).
* Grunt - [grunt-cli](http://gruntjs.com/getting-started)
* Bower - [bower](http://bower.io/) 
* Make sure you install grunt-cli globally using `npm install -g grunt-cli`.
* Make sure you install bower globally using `npm install -g bower`.
* MariaDB - Download and install [MariaDB](https://downloads.mariadb.org/).

### Additional Packages

Additional dependencies are defined as npm modules in the [package.json](/package.json) file. 

## Quick Install

  The quickest way to get started with UPRM-CMS is to utilize it like this:

  Clone & Run:

    git clone https://github.com/ebreijo/UPRM-CMS.git
    cd UPRM-CMS
    npm install && bower install
    grunt serve

  Then open a browser and go to:

    https://localhost:9000

## Project Structure

  The structure of the project is as follows:
  
    .
    ├── app                       # Client-side (Front-end) of the application.
    │    ├── images               # Images of the project.
    │    ├── media                # Contains all the image/file uploads.
    │    ├── scripts              # Javascript files.
    │    │      ├── controllers   # Controllers of the application. They are divided by students, companies and admins.
    │    │      ├── directives    # File upload directive.
    │    │      ├── filters       # Filters of the application.
    │    │      ├── services      # Services of the application. Requests to the server are done here.
    │    │      └── app.js        # Angular app configuration.
    │    ├── styles               # CSS files.
    │    ├── views                # HTML files.
    │    │      ├── partials      # Contains all the HTML files of the application. They are divided by students, companies and admins.
    │    │      └── index.html    # All script and style files are added here.
    │    ├── .htaccess            # Apache configuration file
    │    └── favicon.ico          # Fav icon
    ├── database                  # Database of the project.
    ├── lib                       # Server-side (Back-end) of the application.
    │    ├── config               # Configuaration of the project.
    │    │      ├── env           # Environment configuration of the project. Database configuration.
    │    │      ├── config.js     # Load environment configuration.
    │    │      ├── express.js    # Express configuration.
    │    │      └── passport.js   # Passport configuration. Two types of strategies: local-user for admins and recrutiers, local-student for students.
    │    ├── controllers          # Controllers/handlers of the server.
    │    ├── models               # Mapping of the database tables.
    │    ├── routes               # End points of the server.
    │    ├── angular.js           # Serve all the angular HTMLs.
    │    ├── authType.js          # Assign and determine the type of user of the application.
    │    ├── fileUpload.js        # File upload configuration.
    │    ├── mailer.js            # Email configuration for notifications. Email templates.
    │    └── middleware.js        # Contains helper functions such as authentication verification, and file cleaner.
    ├── test                      # Back-end and Front-end tests.
    │    ├── mock                 # Mock state transitions.
    │    ├── server               # Server tests.
    │    │     ├── controllers    # Test logic of each controller of the server by sending requests and checking response.
    │    │     └── seedData       # Scripts to populate the database. Note the productionPopulateDB.sql file.
    │    └── spec                 # Front-end unit tests.
    │          ├── controllers    # Unit test each controller of the client. They are divided by students, companies and admins.
    │          └── services       # Unit test most important services of the application.
    ├── bower.json                # Front-end dependencies of the project.
    ├── Gruntfile.js              # Configuration file for automated tasks, such as build, serve, test. Server tests are configured here as well.
    ├── karma.conf.js             # Configuration file for fron-end tests.
    ├── key.pem                   # RSA Private Key used to generate our certificate.
    ├── key-cert.pem              # Certificate.
    ├── package.json              # Server-side dependencies of the project defined as npm modules.
    ├── README.md                 # Instructions and information about the project.
    └── server.js                 # Main application file of the server.
    
## Stack of Technologies

  The technologies used in the project are as follows:
  
    Database
        RDBMS: MariaDB
        ORM: Sequelize
    Back-end 
        Server: Node.js + Express
        Authentication: Passport.js
        Test: Mocha.js + Chai.js
    Front-end:
        Client: AngularJS + Bootstrap
        File Upload: DropzoneJS
        Test: Karma + Jasmine
    Dev task runner: Grunt
    Production/Deployment: PM2
    
## Configuration

  All configuration is specified in the [config](/lib/config) folder, particularly the [config.js](/lib/config/config.js) file.

### Environmental Settings

  To run with a different environment, just specify NODE_ENV as you call grunt:

    $ NODE_ENV=test grunt

   The environment can be test, development (default) or production and can be configured as above or by setting NODE_ENV as environment variable.
   
   Before running the project in production environment, in addition to specify NODE_ENV=production you need to specify the following environment variables:
    
    UPRM_CMS_DB_USER
    UPRM_CMS_DB_PASSWORD
    UPRM_CMS_DB
    UPRM_CMS_DB_PORT
    UPRM_CMS_DB_HOST
    
   The project has email notifications. To set the email account you need to specify the following environment variables:
    
    MAILER_EMAIL
    MAILER_PASS
    
   To run the project in production environment, you need to run:
      
    $ grunt serve:production
    
   Then open a browser and go to:
    
    https://localhost:9000
    
   Note that if you are using Grunt, the default port is 9000.
    
   We recommend using [PM2](http://pm2.keymetrics.io/) for production. After installing it and after setting all the above environment variables you can run the following command to start the server:
   
    $ pm2 start server.js -n uprm_cms -i 0
    
   Then open a browser and go to:
       
    https://localhost:3000
    
   Note that the default port of the application is 3000. You can change it by specifying the following environment variable:
   
    PORT

   Some other useful commands about PM2 can be found on [Commands-Overview](https://github.com/Unitech/pm2#commands-overview).
   
## Code Style

  We enforce the following general settings:

    indent_style = space
    indent_size = 2
    continuation_indent_size = 4
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true


  We use the following JavaScript [Style Guide](http://goo.gl/b3LFBH) as our JS coding standards.

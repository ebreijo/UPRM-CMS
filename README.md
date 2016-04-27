UPRM-CMS
========

## Description

UPRM Career Management System (UPRM-CMS) is a web application designed to provide an enhanced experience for companies, students, and the Placement Office employees. This content management system provides to companies the ability to create and edit their company profiles, post job offers, and the capability of adding extra data and request on campus services. In addition, administrators will be able to manage the content that is displayed on the web application.

## Prerequisites

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
    
   We recommend using [PM2](http://pm2.keymetrics.io/) for production. After installing it anf after setting all the above environment variables you can run the following command:
   
    $ pm2 start server.js -n uprm_cms -i 0
    
   Then open a browser and go to:
       
    https://localhost:3000
    
   Note that the default port of the application is 3000. You can change it by specifying the following environment variable:
   
    PORT

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

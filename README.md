UPRM-CMS
========

## Description

UPRM Career Management System (UPRM-CMS) is a web application designed to provide an enhanced experience for companies, students, and the Placement Office employees. This content management system provides to companies the ability to create and edit their company profiles, post job offers, and the capability of adding extra data and request on campus services. In addition, administrators will be able to manage the content that is displayed on the web application.

## Prerequisites

* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/).
* Grunt - [grunt-cli](http://gruntjs.com/getting-started)
* Make sure you install grunt-cli globally using `npm install -g grunt-cli`.
* MariaDB - Download and install [MariaDB] (https://downloads.mariadb.org/).

### Additional Packages

Additional dependencies are defined as npm modules in the [package.json](/package.json) file. 

## Quick Install

  The quickest way to get started with UPRM CMS is to utilize it like this:

  Clone & Run:

    git clone https://github.com/ebreijo/UPRM-CMS.git
    cd uprm_cms
    npm install && bower install
    grunt serve

  Then open a browser and go to:

    http://localhost:9000

## Configuration

  All configuration is specified in the [config](/lib/config) folder, particularly the [config.js](/lib/config/config.js) file.

### Environmental Settings

  To run with a different environment, just specify NODE_ENV as you call grunt:

    $ NODE_ENV=test grunt

   The environment can be test, development or production and can be configured as above. 

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

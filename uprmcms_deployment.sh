#!/bin/bash
# Install prerequisites
npm install -g grunt-cli
npm install -g bower

# Install dependencies
npm install
bower install --allow-root
npm rebuild

# Set environement variables (only for production)
export NODE_ENV=production # This will depend on what CTI wants

export UPRM_CMS_DB_USER=testuser # For Production CTI use: uprmcms
export UPRM_CMS_DB_PASSWORD=testpassword # For Production CTI use: uprmcms2016
export UPRM_CMS_DB=uprm_cms_test # For Production CTI use: uprmcms
export UPRM_CMS_DB_PORT=3306
export UPRM_CMS_DB_HOST=testdbinstance.cnsxpdncq5ug.us-west-2.rds.amazonaws.com  # For Production in CTI use: localhost

export MAILER_EMAIL=capstone.webhunters@gmail.com   # uprmcms@uprm.edu
export MAILER_PASS=icom5047                         # Colegio2016

export BLUEBIRD_DEBUG=0

# Install pm2 - A production process manager with a built-in load balancer
npm install pm2 -g

# Kill pm2 process in case cluster mode doesn't work because of Error: ENOENT, no such file or directory for process.cwd()
# pm2 kill

# Start the application uprm_cms in cluster mode with maximum processes depending on available CPUs
pm2 start server.js -n uprm_cms -i 0

# Show logs in console
pm2 logs uprm_cms

# To stop the server and clusters
# pm2 stop all

# To kill and delete all apps
# pm2 delete all

# You can start the application using grunt as well
# grunt serve:production

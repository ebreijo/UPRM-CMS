// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/lodash/dist/lodash.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-ui-utils/jq.js',
      'app/bower_components/ngstorage/ngStorage.js',
      'app/bower_components/angular-cryptography/mdo-angular-cryptography.js',
      'app/bower_components/angular-loading-bar/src/loading-bar.js',
      'app/bower_components/restangular/dist/restangular.js',
      'app/bower_components/flexslider/jquery.flexslider.js',
      'app/bower_components/jflickrfeed/jflickrfeed.js',
      'app/bower_components/gmaps/gmaps.js',
      'app/bower_components/jquery-placeholder/jquery.placeholder.js',
      'app/bower_components/jquery-prettyPhoto/js/jquery.prettyPhoto.js',
      'app/bower_components/dropzone/dist/min/dropzone.min.js',
      'app/bower_components/angular-local-storage/dist/angular-local-storage.js',
      'app/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
      'app/bower_components/angular-xeditable/dist/js/xeditable.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    captureTimeout: 10000,

    // report to get the logs via console
    reporters: ['verbose'],
    
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};

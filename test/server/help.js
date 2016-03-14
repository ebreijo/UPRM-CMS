'use strict';

var _ = require('lodash'),
  util = require('util');

function error(msg, expected, actual) {
  var err = new Error(msg);
  err.expected = expected;
  err.actual = actual;
  err.showDiff = true;
  return err;
}

exports.isBodyEqual = function(expected, done) {
  return function(err, res) {
    if (err) {
      return done(err);
    } else {
      var body = res.body;

      if(_.isEqual(expected, body)) {
        done();
      } else {
        var a = util.inspect(expected);
        var b = util.inspect(body);
        done(error('Expected: ' + a + '\n Got: ' + b, a, b));
      }
    }
  }
};

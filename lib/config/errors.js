'use strict';

var errors = require('errors');

errors.create({
  name: 'ValidationError',
  defaultMessage: 'The object sent is invalid',
  defaultExplanation: 'Some properties are not valid',
  defaultResponse: 'Resend the object with valid properties',
  code: 400,
  parent: errors.Http400Error
});

errors.create({
  name: 'DatabaseError',
  defaultMessage: 'An error occurred communicating with the database',
  defaultExplanation: 'Something went wrong',
  defaultResponse: 'Please try again later',
  code: 500,
  parent: errors.Http500Error
});

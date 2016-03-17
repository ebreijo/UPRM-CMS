'use strict';

var RNCryptor = require('jscryptor');
var password = 'FD477B24F877040A6E9865CC5E9646B7BF76C0006A53ADC1';

function encrypt(json) {
  return RNCryptor.Encrypt(JSON.stringify(json), password);
}

function decrypt(jsonString) {
  return RNCryptor.Decrypt(jsonString, password);
}

/**
 * Encrypt a JSON to be sent.
 */
exports.encryptJSON = function(json) {
  var encryptedJSON = encrypt(json);
  return { uprmcms: encryptedJSON };
};

/**
 * Decrypt a JSON that was received.
 */
exports.decryptReceivedJSON = function(receivedJSON) {
  var encryptedJSONString = receivedJSON.uprmcms;
  var decryptedJSONString = decrypt(encryptedJSONString);
  return JSON.parse(decryptedJSONString);
};

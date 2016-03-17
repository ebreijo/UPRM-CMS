'use strict';

var expect = require('chai').expect;
var crypto = require('../../../lib/config/crypto');

describe('Cryptography Module Controller: ', function() {

  describe('Decrypt a Received JSON', function () {
    /**
     * Encrypted JSON IS:
     * {
     *  id:1,
     *  companyName:'IBM'
     * }
     * */
    var encryptedJSON = {
      uprmcms: 'AwFp1kRpiXdJLY3jn9YoNrYhLlDipiatYmJ/JZXXlvONJQUbqqcOYYdW9hGIFQFzaU6+7H8JDcKcBab+wSf0z4/cpEFH72H9DP2HlyMmLzUmQuqXsXDZRPLxZVoPTMyuTTc='
    };

    it('should test if the decrypted json has an ID', function () {
      expect(crypto.decryptReceivedJSON(encryptedJSON))
        .to
        .have
        .property('id');
    });

    it('should test if the decrypted json has a company name', function () {
      expect(crypto.decryptReceivedJSON(encryptedJSON))
        .to
        .have
        .property('companyName');
    });
  });

});

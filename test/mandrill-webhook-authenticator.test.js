(function() {
  'use strict';

  var expect = require('chai').expect;
  var request = require('supertest');
  var express = require('express');

  var authenticator = require('../src/mandrill-webhook-authenticator');

  var app = express();

  describe('#mandrill-webhook-authenticator', function() {

    it('accepts a configuration', function() {
      expect(authenticator.length).to.equals(1);
    });

    it('returns a function that takes three parameters', function() {
      expect(authenticator({ domain: 'some domain', webhookAuthKey: 'some webhookAuthKey' }).length).to.equals(3);
    });

    describe('validates the configuration early', function() {

      it('checks for webhookAuthKey', function() {
        var testFunction = function() { authenticator();};

        expect(testFunction).to.throw(Error, /Configuration is incomplete/);
      });

      it('checks for domain', function() {
        var testFunction = function() { authenticator({ webhookAuthKey: 'some webhookAuthKey' });};

        expect(testFunction).to.throw(Error);
      });

      it('should load if all parameters exist', function() {
        var testFunction = function() { authenticator({ domain: 'some domain', webhookAuthKey: 'some webhookAuthKey' });};

        expect(testFunction).to.not.throw(Error);
      });

    });

    describe('should validate X-Mandrill-Signature header', function() {

      app.use(authenticator({ domain: 'http://test/com', webhookAuthKey: 'some_auth_key', }));

      it('No header: Not Authorized', function(done) {
        request(app).post('/webhook').expect(401, done);
      });

      it('Invalid header: Forbidden', function(done) {
        request(app)
        .post('/webhook')
        .set('X-Mandrill-Signature', 'invalidSignature')
        .expect(403, done);
      });

      it('should call next once if the signature is valid', function(done) {
        var req = { url:'/webhook', headers: {}, body: {} };
        req.headers['x-mandrill-signature'] = 'xHQjU8Pwhauh98J3jrI3Nb76OSI=';
        req.body.mandrill_events = '[{"msg": {"from_email": "test@example.com"}}]';

        var authenticate = authenticator({ domain: 'http://test/com', webhookAuthKey: 'some_auth_key', });

        authenticate(req, {}, done);
      });

    });

  });
})();

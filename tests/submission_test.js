var app = require('..');
var request = require('supertest');

describe('Submissions', function () {
  describe('submission created', function() {
    describe('first payment submitted', function() {
      it('submission total should be equal to first payment', function(done) {
        done();
      });

      describe('second payment submitted', function() {
        it('submission total should be equal to sum of first and second payment', function(done) {
          done();
        });
      })
    })
  });
});

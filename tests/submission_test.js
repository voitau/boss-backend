var app = require('..');
var request = require('supertest');
var assert = require('chai').assert;

describe('Submissions', function () {

  it('should not post totalDonations amount', function(done) {
    var submissionSpec = {
      photoURL: "url",
      location: "10,10",
      status: "CREATED",
      category: "POTHOLE",
      totalDonationAmount: 10
    };

    request(app)
      .post('/api/Submissions')
      .set('Content-Type', 'application/json')
      .send(submissionSpec)
      .expect(200)
      .end(function (err, response) {
        var submission = response.body;
        assert.isUndefined(submission.totalDonationAmount);
        done();
      });
  });

  describe('submission created', function() {

    var submission;

    beforeEach(function(done) {
      var submissionSpec = {
        photoURL: "url",
        location: "10,10",
        status: "CREATED",
        category: "POTHOLE"
      };

      request(app)
        .post('/api/Submissions')
        .set('Content-Type', 'application/json')
        .send(submissionSpec)
        .expect(200)
        .end(function (err, response) {
          submission = response.body;
          done();
        });
    });

    describe('first payment submitted', function() {

      var firstPayment;

      beforeEach(function(done) {
        firstPayment = {
          amount: 10,
          paymentMethodNonce: "thisisnonce"
        };

        request(app)
          .post('/api/Submissions/' + submission.id + '/payments')
          .set('Content-Type', 'application/json')
          .send(firstPayment)
          .expect(200)
          .end(done);
      });

      it('submission total should be equal to first payment', function(done) {
        request(app)
          .get('/api/Submissions/' + submission.id + '')
          .expect(200)
          .end(function (err, response) {
            var submission = response.body;
            assert.equal(submission.photoURL, 'url');
            assert.equal(submission.totalDonationAmount, firstPayment.amount);
            done();
          });
      });

      describe('second payment submitted', function() {

        var secondPayment;

        beforeEach(function(done) {
          secondPayment = {
            amount: 20,
            paymentMethodNonce: "thisisnonce"
          };

          request(app)
            .post('/api/Submissions/' + submission.id + '/payments')
            .set('Content-Type', 'application/json')
            .send(secondPayment)
            .expect(200)
            .end(function (err, response) {
              done();
            });
        });

        it('submission total should be equal to sum of first and second payment', function(done) {
          request(app)
            .get('/api/Submissions/' + submission.id + '')
            .expect(200)
            .end(function (err, response) {
              var submission = response.body;
              assert.equal(submission.photoURL, 'url');
              assert.equal(submission.totalDonationAmount, firstPayment.amount + secondPayment.amount);
              done();
            });
        });
      })
    })
  });
});

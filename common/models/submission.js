var async = require('async');
var braintree = require("braintree");

module.exports = function(Submission) {
  Submission.validatesInclusionOf('status', {in: [
    'CREATED',
    'ASSIGNED',
    'PENDING_ACCEPTANCE',
    'ACCEPTED',
    'IN_PROGRESS',
    'COMPLETED'
  ]});

  Submission.validatesInclusionOf('category', {in: [
    'POTHOLE',
    'DEBRIS',
    'DAMAGED_SIDEWALK',
    'STREET_SWEEPING',
    'BROKEN_STREETLIGHTS'
  ]});

  Submission.beforeRemote('create', function(ctx, unused, next) {
    delete ctx.args.data.totalDonationAmount;
    next();
  });

  Submission.beforeRemote('upsert', function(ctx, unused, next) {
    var Payment = Submission.app.models.Payment;
    var submission = ctx.args.data;
    if (submission.status == 'ACCEPTED') {
      var config = Payment.app.get('braintree');
      var gateway = braintree.connect({
        environment:  braintree.Environment.Sandbox,
        merchantId: config.merchantId,
        publicKey: config.publicKey,
        privateKey: config.privateKey
      });

      Payment.find({where: {submissionId: submission.id}}, function(err, payments) {
        if (err) return next(err);
        async.each(
          payments,
          function(payment, pcb) {
            gateway.transaction.releaseFromEscrow(payment.btTransactionId, function(err, result) {
              if (err) return pcb(err);
              console.log(result);
              pcb();
            });
          },
          function(err) {
            if (err) {
              console.log(err);
            }
          }
        );
        next();
      });
    } else {
      next();
    }
  });

  Submission.afterRemote('**.__create__payments', function (ctx, result, next) {
    var payment = ctx.result;
    var currentTotalDonationAmount = ctx.instance.__data.totalDonationAmount || 0;
    ctx.instance.updateAttributes({totalDonationAmount: currentTotalDonationAmount + payment.amount}, function(err, instance) {
      if (err) return next(err);

      var config = Submission.app.get('braintree');
      if (config.merchantId != "define") {
        var gateway = braintree.connect({
          environment: braintree.Environment.Sandbox,
          merchantId: config.merchantId,
          publicKey: config.publicKey,
          privateKey: config.privateKey
        });

        gateway.transaction.sale({
          amount: payment.amount,
          paymentMethodNonce: payment.paymentMethodNonce,
          merchantAccountId: 'felixjustfelix',
          options: {
            submitForSettlement: true,
            holdInEscrow: true
          },
          serviceFeeAmount: '2'
        }, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if (result.transaction) {
              payment.updateAttributes({btTransactionId: result.transaction.id}, function (err, updatedPayment) {
                if (err) {
                  console.log(err);
                }
                next();
              });
            }
          }
        });
      } else {
        next();
      }
    });
  });

};

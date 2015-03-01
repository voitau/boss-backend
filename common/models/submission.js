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

  Submission.afterRemote('**.__create__payments', function (ctx, result, next) {
    var payment = ctx.result;
    var currentTotalDonationAmount = ctx.instance.__data.totalDonationAmount || 0;
    ctx.instance.updateAttributes({totalDonationAmount: currentTotalDonationAmount + payment.amount}, function(err, instance) {
      if (err) return next(err);
      next();
    });
  });

};

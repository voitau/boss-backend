module.exports = function(Submission) {
  Submission.validatesInclusionOf('status', {in: [
    'CREATED',
    'ASSIGNED',
    'PENDING_ACCEPTANCE',
    'ACCEPTED',
    'IN_PROGRESS',
    'COMPLETED'
  ]});
};

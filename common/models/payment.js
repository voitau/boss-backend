var braintree = require("braintree");

module.exports = function(Payment) {
  Payment.beforeCreate = function(next, payment) {
    var config = Payment.app.get('braintree');
    var gateway = braintree.connect({
      environment:  braintree.Environment.Sandbox,
      merchantId: config.merchantId,
      publicKey: config.publicKey,
      privateKey: config.privateKey
    });

    gateway.transaction.sale({
      amount: payment.amount,
      paymentMethodNonce: payment.paymentMethodNonce
    }, function (err, result) {
      if (err) {
        console.log(err);
      }
      next();
    });
  };

};

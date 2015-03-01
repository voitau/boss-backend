var braintree = require("braintree");

module.exports = function(ClientToken) {

  ClientToken.generate = function(cb) {
    var config = ClientToken.app.get('braintree');
    var gateway = braintree.connect({
      environment:  braintree.Environment.Sandbox,
      merchantId: config.merchantId,
      publicKey: config.publicKey,
      privateKey: config.privateKey
    });

    gateway.clientToken.generate({}, function (err, response) {
      if (err) return cb(err);

      cb(null, {token: response.clientToken});
    });
  };

  ClientToken.remoteMethod(
    'generate',
    {
      http: {path: '/generate', verb: 'get'},
      returns: {arg: 'body', type: 'ClientToken', root: true}
    }
  );

};

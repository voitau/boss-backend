module.exports = function(Container) {
  Container.disableRemoteMethod('getContainer', true);
  Container.disableRemoteMethod('getContainers', true);
  Container.disableRemoteMethod('destroyContainer', true);
  Container.disableRemoteMethod('createContainer', true);
  Container.disableRemoteMethod('removeFile', true);

};

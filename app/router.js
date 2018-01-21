'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', 'home.index');
  router.resources('image', '/image', 'image');
  router.resources('container', '/container', 'container');
  router.delete('/container', 'container.destroyAll');
};

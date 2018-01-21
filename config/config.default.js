'use strict';

module.exports = appInfo => {
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_ ';

  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.nj',
    mapping: {
      '.nj': 'nunjucks',
    },
  };

  return config;
};
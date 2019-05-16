const handle = require('../nextApp').handle;
const path = require('path');
const jetpack = require('fs-jetpack');

const nextPages = new Set(jetpack.cwd(path.join(__dirname, '..','..','client','pages')).list().map(n => n.split(path.sep).pop().split('.').shift()));
nextPages.add('');

module.exports = function() {
  return function next(req, res, next) {
    return ((req.path.indexOf('/_next') === 0) || nextPages.has(req.path.split('/').pop())) ? handle(req, res) : next();
  };
};

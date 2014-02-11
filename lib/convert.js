
var fs = require('fs');
var path = require('path');
var resize = require('./resize');
var Svgo = require('svgo');

var extname = path.extname;
var join = path.join;
var read = fs.readFileSync;
var write = fs.writeFileSync;

/**
 * Expose `convert`.
 */

module.exports = convert;

/**
 * Svg.
 */

var svg = new Svgo();

/**
 * Process an SVG `file` for a given logo component `dir` and save it to the
 * images directory.
 *
 * @param {String} dir
 * @param {String} file
 * @param {Function} fn
 */

function convert(dir, file, fn){
  if ('.svg' != extname(file)) return fn(new Error('must be an .svg file'));
  var str = read(file, 'utf8');

  svg.optimize(str, function(res){
    write(join(dir, 'images/logo.svg'), res.data);
    resize(dir, function(err){
      if (err) exit(err);
    });
  });
}

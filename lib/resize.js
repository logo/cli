#!/usr/bin/env node

var css = require('css');
var fatal = require('./utils').fatal;
var fs = require('fs');
var path = require('path');

var exists = fs.existsSync;
var join = path.join;
var read = fs.readFileSync;
var resolve = path.resolve;
var write = fs.writeFileSync;

/**
 * Expose `resize`.
 */

module.exports = resize;

/**
 * Resize an logo component's CSS given a `dir`.
 *
 * @param {String} dir
 * @param {Function} fn
 */

function resize(dir, fn){
  var paths = {
    json: join(dir, 'component.json'),
    css: join(dir, 'index.css'),
    svg: join(dir, 'images', 'logo.svg')
  };

  if (!exists(paths.json)) return fn(new Error('not a logo component directory.'));
  if (!exists(paths.svg)) return fn(new Error('could not find "./images/logo.svg"'));
  if (!exists(paths.css)) return fn(new Error('could not find "./index.css"'));

  /**
   * SVG.
   */

  var svg = read(paths.svg, 'utf8');
  var width = parseFloat(match(/<svg.*?width="([\.\d]+)"/, svg), 10);
  var height = parseFloat(match(/<svg.*?height="([\.\d]+)"/, svg), 10);

  if (!width) return fn(new Error('sVG has no width property.'));
  if (!height) return fn(new Error('sVG has no height property.'));

  /**
   * CSS.
   */

  var conf = require(paths.json);
  var name = conf.logo;
  var ast = css.parse(read(paths.css, 'utf8'));
  var rules = ast.stylesheet.rules;
  var margin;

  rules.forEach(function(rule){
    var match = '.logo[data-logo="' + name + '"] > *';
    if (!rule.selectors) return;
    if (!~rule.selectors.indexOf(match)) return;

    rule.declarations.forEach(function(dec){
      if ('margin' != dec.property) return;
      margin = shorthand(dec.value);
    });
  });

  rules.forEach(function(rule){
    var match = '.logo[data-logo="' + name + '"]';
    if (!rule.selectors) return;
    if (!~rule.selectors.indexOf(match)) return;

    rule.declarations.forEach(function(dec){
      if ('width' != dec.property) return;
      dec.value = calc(width, height, margin) + 'em';
    });
  });

  write(paths.css, '\n' + css.stringify(ast));
  fn();
}

/**
 * Match helper.
 *
 * @param {RegExp} regexp
 * @param {String} string
 */

function match(regexp, string){
  var m = regexp.exec(string);
  if (!m) return;
  return m[1];
}

/**
 * Re-calculate a width in ems given `width`, `height` and `margin`.
 *
 * @param {String} width
 * @param {String} height
 * @param {Object} margin
 * @return {Number}
 */

function calc(w, h, m){
  return (w / h) * (1 - m.top - m.bottom) + m.left + m.right;
}

/**
 * Parse a top-right-bottom-left CSS shorthand.
 *
 * @param {String} string
 * @return {Object}
 */

function shorthand(string){
  string = string || '';
  var ret = {};
  var parts = string.split(' ').map(function(str) { return parseFloat(str, 10); });

  switch (parts.length) {
    case 1:
      ret.top = ret.right = ret.bottom = ret.left = parts[0];
      break;
    case 2:
      ret.top = ret.bottom = parts[0];
      ret.right = ret.left = parts[1];
      break;
    case 3:
      ret.top = parts[0];
      ret.right = ret.left = parts[1];
      ret.bottom = parts[2];
      break;
    case 4:
      ret.top = parts[0];
      ret.right = parts[1];
      ret.bottom = parts[2];
      ret.left = parts[3];
      break;
    default:
      ret.top = ret.right = ret.bottom = ret.left = 0;
  }

  return ret;
}

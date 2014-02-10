
/**
 * Log an error and exit.
 *
 * @param {String} msg
 * @param {Mixed} values...
 */

exports.fatal = function(){
  var args = [].slice.call(arguments);
  console.error.apply(console, args);
  process.exit(1);
}
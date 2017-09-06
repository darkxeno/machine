/**
 * Module dependencies
 */

var Promise = require('bluebird');


/**
 * `Machine.prototype.then()`
 *
 * @returns {Ref} a promise to control the execution of the machine
 * @throws {Error} If machine triggers any other exit
 * @chainable
 */
module.exports = function then(){

  return new Promise(function(resolve, reject){

    var exitCallbacks = {
      success: function (result){
        resolve(result);
      },
      error: function (err){
        reject(err);
      }
    };

    return this.exec(exitCallbacks);
  }
};

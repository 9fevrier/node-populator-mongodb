'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _bunyan = require('bunyan');

var bunyan = _interopRequireWildcard(_bunyan);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _path = require('path');

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 9 Février
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * # Node Populator for MongoDB: entry point.
 *
 * (c) 2016, 9 Février <contact@9fevrier.com>
 *
 * This file is a part of Node Populator for MongoDB.
 */

// import * as promisifyAll from 'es6-promisify-all';
// The logger.
var LOG = (0, _bunyan.createLogger)({ name: __filename });

/**
 * # Helper for MongoDB populating
 *
 */
function PopulatorMongo(host, port, dbname, resourcesPath, collections) {
  var coll = null;
  var db = new _mongodb2.default.Db(dbname, new _mongodb2.default.Server(host, port));
  var p1 = db.open();
  p1 = p1.then(function (db) {
    db = db;
  });
  p1 = p1.then(function () {
    coll = db.collection('test');
  });
  p1 = p1.then(function () {
    var stack = [];
    collections.map(function (name) {
      var p = db.collection(name).drop();
      stack.push(p);
    });
    return Promise.all(stack);
  });
  p1 = p1.then(function () {
    var stack = [];
    collections.map(function (name) {
      var p = db.collection(name).insertMany(require((0, _path.join)(resourcesPath, name)));
      stack.push(p);
    });
    return Promise.all(stack);
  });
  p1 = p1.then(function () {
    console.log('close');
    return db.close();
  });

  p1.catch(function (err) {
    return console.log;
  });
  return p1;
}

exports.default = PopulatorMongo;
module.exports = exports['default'];
//# sourceMappingURL=node-populator-mongodb.dist.js.map

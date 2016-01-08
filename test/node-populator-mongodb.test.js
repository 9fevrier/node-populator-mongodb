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
 * # Node Populator for MongoDB: unit tests.
 *
 * (c) 2016, 9 Février <contact@9fevrier.com>
 *
 * This file is a part of Node Populator for MongoDB.
 */

'use strict'; // eslint-disable-line strict

// ## Imports

// Common imports
const should = require('should'); // eslint-disable-line no-unused-vars
const promisifyAll = require('es6-promisify-all');
const mongodb = promisifyAll(require('mongodb'));
const bunyan = require('bunyan');

// Project imports
const PopulatorMongo = require('../dist/index');  // eslint-disable-line no-unused-vars

// Logger
const LOG = bunyan.createLogger({name: __filename});

let db = null;

/**
 * ## Unit tests: PopulatorMongo.
 */
describe('PopulatorMongo', () => { // eslint-disable-line no-undef

  beforeEach((done) => { // eslint-disable-line no-undef
    mongodb.MongoClient.connect('mongodb://localhost:27017/populator_test')
      .then((connection) => {
        db = connection;
        done();
      }, done);
  });

  afterEach((done) => { // eslint-disable-line no-undef
    db.close(done);
  });

// **The derived class should have an incremented value.**
  it('should have two projects and two customers', (done) => { // eslint-disable-line no-undef
    const populator = new PopulatorMongo('mongodb://localhost:27017/populator_test', '../test/resources/', ['customers', 'projects']);
    populator.populate((instance) => { // eslint-disable-line no-unused-vars
      LOG.info('db = ' + db);
    }).stream().then(() => {
      LOG.info('db = ' + db);
      done();
    }, done);
  });
})
;

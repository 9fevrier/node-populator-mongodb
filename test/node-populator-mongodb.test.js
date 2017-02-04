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
const PopulatorMongo = require('../dist/node-populator-mongodb.dist');  // eslint-disable-line no-unused-vars

// Logger
const LOG = bunyan.createLogger({name: __filename}); // eslint-disable-line no-unused-vars

let db = null;
let conn = null;

const host = 'localhost';
const port = 27017
const dbname = 'pop_test';


/**
 * ## Unit tests: PopulatorMongo.
 */
describe('PopulatorMongo', () => { // eslint-disable-line no-undef

  before((done) => { // eslint-disable-line no-undef
    db = new mongodb.Db(dbname, new mongodb.Server(host, port));
    db.open().then((conn) => { conn = conn; done(); }).catch((err) => {
      console.log('error: ' + err.stack)
    });
  });

  after((done) => { // eslint-disable-line no-undef
    db.close(done);
  });

// **The derived class should have an incremented value.**
  it('should have 2 customers', (done) => { // eslint-disable-line no-undef
    const populator = PopulatorMongo(host, port, dbname, '../test/resources/', ['customers', 'projects']);
    populator.then((instance) => { // eslint-disable-line no-unused-vars
      db.collection('customers').count().then((number) => {
        number.should.be.equal(5);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should have 3 customers', (done) => { // eslint-disable-line no-undef
    const populator = PopulatorMongo(host, port, dbname, '../test/resources/', ['customers', 'projects']);
    populator.then((instance) => { // eslint-disable-line no-unused-vars
      db.collection('projects').count().then((number) => {
        number.should.be.equal(3);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  })
});

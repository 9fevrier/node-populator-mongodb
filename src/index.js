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

'use strict'; // eslint-disable-line strict


import * as _ from 'lodash';
import * as bunyan from 'bunyan';
import * as mongodb_ from 'mongodb';
// import * as promisifyAll from 'es6-promisify-all';
const promisifyAll = require('es6-promisify-all');
// import * as PromisesControlFlow from 'pigalle-promises-control-flow';
const PromisesControlFlow = require('pigalle-promises-control-flow');
import * as path from 'path';

const mongodb = promisifyAll(mongodb_);
const MongoClient = mongodb.MongoClient;

// The logger.
const LOG = bunyan.createLogger({name: __filename});

/**
 * # Helper for MongoDB populating
 *
 */
class PopulatorMongo extends PromisesControlFlow {

  /**
   * ### constructor(uri, collections)
   *
   * Constructor.
   *
   */
  constructor(uri, resourcesPath, collections) {
    LOG.info('create a new instance of MongoPopulator');
    super();
    this.uri = uri;
    this.collections = collections;
    this.path = resourcesPath;
    this._connection = null;
    return this;
  }

  /**
   * ### connect()
   *
   */
  connect() {
    LOG.info('connect to the database');
    return this.next(() => {
      return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        MongoClient.connect(this.uri)
          .then((connection) => {
            this._connection = connection;
            resolve(this);
          });
      });
    });
  }

  /**
   * ### dropCollections()
   *
   * Drop all collections.
   *
   */
  drop() {
    return this.next(() => {
      LOG.info('drop old collections');
      const stack = [];
      this.collections.map((name) => {
        LOG.info('try to drop collection: ' + name);
        stack.push(this._connection.collection(name).deleteMany({}));
        stack.push(this._connection.collection(name).deleteMany({}));
      })
      ;
      return Promise.all(stack);
    })
      ;
  }

  /**
   * ### insertDocumentsInCollections
   *
   * Insert documents.
   *
   */
  insert() {
    return this.next(() => {
      LOG.info('insert the provided data');
      const stack = [];
      this.collections.map((name) => {
        const data = require(path.join(this.path, name));
        if ((data) && (_.isArray(data)) && (data.length > 0)) {
          stack.push(this._connection.collection(name).insertMany(data));
        }
      });
      return Promise.all(stack);
    });
  }

  /**
   * ## close()
   *
   * Close the current MongoDB connection.
   *
   */
  close() {
    return this.next(() => {
      LOG.info('close');
      return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        this._connection.close();
        resolve(this);
      });
    });
  }

  /**
   * ## populate()
   *
   * Populate the database with testing data.
   *
   */
  populate(fn) {
    return this.connect().drop().insert().done(fn);
  }
}


export default PopulatorMongo;

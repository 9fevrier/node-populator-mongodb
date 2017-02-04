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

import util from 'util';
import * as _ from 'lodash';
import * as bunyan from 'bunyan';
import mongodb from 'mongodb';
// import * as promisifyAll from 'es6-promisify-all';
import * as path from 'path';

const MongoClient = mongodb.MongoClient;
// The logger.
const LOG = bunyan.createLogger({name: __filename});

var dbQueryCounter = 0;
var maxDbIdleTime = 5000; //maximum db idle time

var closeIdleDb = function(connection){
  var previousCounter = 0;
  var checker = setInterval(function(){
    if (previousCounter == dbQueryCounter && dbQueryCounter != 0) {
        connection.close();
        clearInterval(closeIdleDb);
    } else {
        previousCounter = dbQueryCounter;
    }
  }, maxDbIdleTime);
};

/**
 * # Helper for MongoDB populating
 *
 */
export default function PopulatorMongo(host, port, dbname, resourcesPath, collections) {
  let coll = null;
  let db = new mongodb.Db(dbname, new mongodb.Server(host, port));
  let p1 = db.open();
  p1 = p1.then((db) => {
    db = db;
  })
  p1 = p1.then(() => {
    coll = db.collection('test');
  });
  p1 = p1.then(() => {
    const stack = [];
    collections.map((name) => {
      let p = db.collection(name).dropIndexes();
      p = p.catch(err => { })
      stack.push(p);
    });
    return Promise.all(stack);
  })
  p1 = p1.then(() => {
    const stack = [];
    collections.map((name) => {
      let p = db.collection(name).drop();
      p = p.catch(err => { })
      stack.push(p);
    });
    return Promise.all(stack);
  })
  p1 = p1.then(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000)
    });
  })
  p1 = p1.then(() => {
    const stack = [];
    collections.map((name) => {
      const p = db.collection(name).insertMany(require(path.join(resourcesPath, name)));
      stack.push(p);
    });
    return Promise.all(stack);
  })
  p1 = p1.then(() => {
    console.log('close');
    closeIdleDb(db);
    return db.close();
  })


  p1.catch(err => console.log);
  return p1;
}

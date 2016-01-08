'use strict'; // eslint-disable-line strict

const ObjectID = require('mongodb').ObjectID;
const DBRef = require('mongodb').DBRef;

const getDBRef = (collectionName, id) => { // eslint-disable-line no-unused-vars
  return new DBRef(collectionName, id, 'populator_test');
};

module.exports = [
  {_id: new ObjectID('300000000000000000000001'), name: 'Customer 1'},
  {_id: new ObjectID('300000000000000000000002'), name: 'Customer 2'},
];

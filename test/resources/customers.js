'use strict'; // eslint-disable-line strict

const ObjectID = require('mongodb').ObjectID;
const DBRef = require('mongodb').DBRef;

const getDBRef = (collectionName, id) => { // eslint-disable-line no-unused-vars
  return new DBRef(collectionName, id, 'populator_test');
};

module.exports = [
  {_id: new ObjectID('300000000000000000000001'), name: 'Customer 1'},
  {_id: new ObjectID('300000000000000000000002'), name: 'Customer 2'},
  {_id: new ObjectID('300000000000000000000003'), name: 'Customer 3'},
  {_id: new ObjectID('300000000000000000000004'), name: 'Customer 4'},
  {_id: new ObjectID('300000000000000000000005'), name: 'Customer 5'},
];

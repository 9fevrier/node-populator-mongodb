const host = 'localhost';
const port = 27017
const dbname = 'pop_test';

import mongodb from 'mongodb';

let coll = null;
let db = new mongodb.Db(dbname, new mongodb.Server(host, port));
let p1 = db.open();
p1 = p1.then((db) => {
  console.log('connecté')
  db = db;
})
p1 = p1.then(() => {
  console.log('collection')
  coll = db.collection('test');
});
p1 = p1.then(() => {
  console.log('insert');
  coll.insert({name: 'François'})
})


p1.catch(err => console.log);

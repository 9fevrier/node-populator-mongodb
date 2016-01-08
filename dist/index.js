'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _bunyan = require('bunyan');

var bunyan = _interopRequireWildcard(_bunyan);

var _mongodb = require('mongodb');

var mongodb_ = _interopRequireWildcard(_mongodb);

var _path = require('path');

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import * as promisifyAll from 'es6-promisify-all';
var promisifyAll = require('es6-promisify-all');
// import * as PromisesControlFlow from 'pigalle-promises-control-flow';
var PromisesControlFlow = require('pigalle-promises-control-flow');
var mongodb = promisifyAll(mongodb_);
var MongoClient = mongodb.MongoClient;

// The logger.
var LOG = bunyan.createLogger({ name: __filename });

/**
 * # Helper for MongoDB populating
 *
 */

var PopulatorMongo = function (_PromisesControlFlow) {
  _inherits(PopulatorMongo, _PromisesControlFlow);

  /**
   * ### constructor(uri, collections)
   *
   * Constructor.
   *
   */

  function PopulatorMongo(uri, resourcesPath, collections) {
    var _ret;

    _classCallCheck(this, PopulatorMongo);

    LOG.info('create a new instance of MongoPopulator');

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PopulatorMongo).call(this));

    _this.uri = uri;
    _this.collections = collections;
    _this.path = resourcesPath;
    _this._connection = null;
    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  /**
   * ### connect()
   *
   */

  _createClass(PopulatorMongo, [{
    key: 'connect',
    value: function connect() {
      var _this2 = this;

      LOG.info('connect to the database');
      return this.next(function () {
        return new Promise(function (resolve, reject) {
          // eslint-disable-line no-unused-vars
          MongoClient.connect(_this2.uri).then(function (connection) {
            _this2._connection = connection;
            resolve(_this2);
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

  }, {
    key: 'drop',
    value: function drop() {
      var _this3 = this;

      return this.next(function () {
        LOG.info('drop old collections');
        var stack = [];
        _this3.collections.map(function (name) {
          LOG.info('try to drop collection: ' + name);
          stack.push(_this3._connection.collection(name).deleteMany({}));
          stack.push(_this3._connection.collection(name).deleteMany({}));
        });
        return Promise.all(stack);
      });
    }

    /**
     * ### insertDocumentsInCollections
     *
     * Insert documents.
     *
     */

  }, {
    key: 'insert',
    value: function insert() {
      var _this4 = this;

      return this.next(function () {
        LOG.info('insert the provided data');
        var stack = [];
        _this4.collections.map(function (name) {
          var data = require(path.join(_this4.path, name));
          if (data && _.isArray(data) && data.length > 0) {
            stack.push(_this4._connection.collection(name).insertMany(data));
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

  }, {
    key: 'close',
    value: function close() {
      var _this5 = this;

      return this.next(function () {
        LOG.info('close');
        return new Promise(function (resolve, reject) {
          // eslint-disable-line no-unused-vars
          _this5._connection.close();
          resolve(_this5);
        });
      });
    }

    /**
     * ## populate()
     *
     * Populate the database with testing data.
     *
     */

  }, {
    key: 'populate',
    value: function populate(fn) {
      return this.connect().drop().insert().done(fn);
    }
  }]);

  return PopulatorMongo;
}(PromisesControlFlow);

module.exports = PopulatorMongo;
//# sourceMappingURL=index.js.map

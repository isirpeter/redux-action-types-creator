'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ASYNC = exports.SYNC = undefined;

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _compose2 = require('lodash/fp/compose');

var _compose3 = _interopRequireDefault(_compose2);

var _drop2 = require('lodash/fp/drop');

var _drop3 = _interopRequireDefault(_drop2);

var _split2 = require('lodash/fp/split');

var _split3 = _interopRequireDefault(_split2);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var destructPath = (0, _compose3.default)((0, _drop3.default)(1), (0, _split3.default)('_'));
// eslint-disable-next-line
var mergeObjects = function mergeObjects(objects) {
  return _merge2.default.apply(undefined, [{}].concat(_toConsumableArray(objects)));
};

exports.SYNC = _constants.SYNC;
exports.ASYNC = _constants.ASYNC;

exports.default = function (namespace) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (definition) {
    var APP_NAMESPACE = '' + namespace;
    var ASYNC_TYPES_SUFFIX = options.asyncSuffix ? options.asyncSuffix : _constants.ASYNC_TYPES_DEFAULT_SUFFIX;

    var createActionType = function createActionType(typeDefine) {
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      // eslint-disable-next-line
      var constructSyncType = _fp2.default.assocPath(_fp2.default.__, '' + APP_NAMESPACE + path, {});

      // eslint-disable-next-line
      var constructAsyncType = function constructAsyncType(objectPath) {
        return (0, _compose3.default)(_fp2.default.concat(_fp2.default, _fp2.default.assocPath([].concat(_toConsumableArray(objectPath), [_constants.ALL_IN_ASYNC]), _fp2.default.map(function (suffix) {
          return '' + APP_NAMESPACE + path + '_' + suffix;
        })(ASYNC_TYPES_SUFFIX), {})),
        // eslint-disable-next-line
        _fp2.default.map(function (action) {
          return _fp2.default.assocPath([].concat(_toConsumableArray(objectPath), [action]), '' + APP_NAMESPACE + path + '_' + action, {});
        }))(ASYNC_TYPES_SUFFIX);
      };

      var generateTypeForKeys = _fp2.default.map(function (key) {
        return createActionType(typeDefine[key], path + '_' + key);
      });

      var generateSyncType = (0, _compose3.default)(constructSyncType, destructPath);

      var generateAsyncType = (0, _compose3.default)(mergeObjects, constructAsyncType, destructPath);

      var generateTypeForTypeDefine = (0, _compose3.default)(mergeObjects, generateTypeForKeys, _fp2.default.keys);

      return _fp2.default.cond([[_fp2.default.equals(_constants.SYNC), function () {
        return generateSyncType(path);
      }], [_fp2.default.equals(_constants.ASYNC), function () {
        return generateAsyncType(path);
      }], [_fp2.default.T, generateTypeForTypeDefine]])(typeDefine);
    };

    return createActionType(definition);
  };
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SYNC = exports.SYNC = Symbol('SYNC');
var ASYNC = exports.ASYNC = Symbol('ASYNC');
var ALL_IN_ASYNC = exports.ALL_IN_ASYNC = 'ALL';
var ASYNC_TYPES_DEFAULT_SUFFIX = exports.ASYNC_TYPES_DEFAULT_SUFFIX = ['REQUEST', 'SUCCESS', 'FAILURE'];
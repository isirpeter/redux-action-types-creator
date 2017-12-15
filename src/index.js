import _ from 'lodash/fp';
import merge from 'lodash/merge';
import _compose from 'lodash/fp/compose';
import _drop from 'lodash/fp/drop';
import _split from 'lodash/fp/split';

import {
  SYNC,
  ASYNC,
  ALL_IN_ASYNC,
  ASYNC_TYPES_DEFAULT_SUFFIX,
} from './constants';

const destructPath = _compose(_drop(1), _split('_'));
// eslint-disable-next-line
const mergeObjects = (objects) => merge({}, ...objects);

export {
  SYNC,
  ASYNC,
};

export default (namespace, options = {}) => (definition) => {
  const APP_NAMESPACE = `${namespace}`;
  const ASYNC_TYPES_SUFFIX = options.asyncSuffix ? options.asyncSuffix : ASYNC_TYPES_DEFAULT_SUFFIX;

  const createActionType = (typeDefine, path = '') => {
    // eslint-disable-next-line
    const constructSyncType = _.assocPath(_.__, `${APP_NAMESPACE}${path}`, {});

    // eslint-disable-next-line
    const constructAsyncType = (objectPath) =>
      _compose(
        _.concat(_, _.assocPath(
          [...objectPath, ALL_IN_ASYNC],
          _.map(suffix => `${APP_NAMESPACE}${path}_${suffix}`)(ASYNC_TYPES_SUFFIX),
          {},
        )),
        // eslint-disable-next-line
        _.map((action) => _.assocPath(
          [...objectPath, action],
          `${APP_NAMESPACE}${path}_${action}`,
          {},
        )),
      )(ASYNC_TYPES_SUFFIX);

    const generateTypeForKeys = _.map(key => createActionType(typeDefine[key], `${path}_${key}`));

    const generateSyncType = _compose(
      constructSyncType,
      destructPath,
    );

    const generateAsyncType = _compose(
      mergeObjects,
      constructAsyncType,
      destructPath,
    );

    const generateTypeForTypeDefine = _compose(
      mergeObjects,
      generateTypeForKeys,
      _.keys,
    );

    return _.cond([
      [_.equals(SYNC), () => generateSyncType(path)],
      [_.equals(ASYNC), () => generateAsyncType(path)],
      [_.T, generateTypeForTypeDefine],
    ])(typeDefine);
  };

  return createActionType(definition);
};

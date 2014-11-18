'use strict';

var path = require('path'),
    fs = require('fs'),
    q = require('q'),
    touchFile = require('touch');

module.exports = {
  obj2dir: obj2dir,
  dir2obj: dir2obj,
  constants: {
    emptyDirectory: {},
    file: ''
  }
};

/////////////

function obj2dir(obj, dir, opt) {
  void 0;
  var deferred = q.defer();

  obj = obj || {};
  dir = dir || '.';
  opt = opt || {};

  mkdir(dir, {existingDirectoryOkay: true}).then(function() {
    recurseObject(obj, dir, opt).then(function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });
  });

  return deferred.promise;
}

function dir2obj(dir, opt) {
  void 0;
  var accumulator = {},
      deferred = q.defer();

  dir = dir || '.';
  opt = opt || {};

  recurseDirectory(accumulator, dir, opt).then(function(obj) {
    void 0;
    void 0;
    deferred.resolve(accumulator);
  });

  return deferred.promise;
}

/////////////

function recurseObject(obj, dir, opt) {
  void 0;
  var keys = Object.keys(obj),
      i,
      deferred = q.defer(),
      promises = [];

  for (i = 0; i < keys.length; i++) (function(i) {
    var key = keys[i],
        subObj = obj[key],
        subPath = path.join(dir, key);

    if (isObject(subObj)) {
      promises.push(mkdir(subPath, opt).then(function() {
        recurseObject(subObj, subPath, opt);
      }));
    } else {
      promises.push(touch(subPath, opt));
    }
  })(i);

  q.all(promises).then(function() {
    deferred.resolve();
  });

  return deferred.promise;
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function mkdir(dir, opt) {
  void 0;
  opt = opt || {};

  var deferred = q.defer();

  fs.mkdir(dir, function(err) {
    if (err) {
      void 0;
      void 0;
      if (opt.existingDirectoryOkay && err.code === 'EEXIST') {
        fs.stat(dir, function(err, stats) {
          if (!err && stats.isDirectory()) {
            deferred.resolve();
          } else {
            deferred.reject(err);
          }
        });
      } else {
        deferred.reject(err);
      }
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}

function touch(path, opt) {
  void 0;
  var deferred = q.defer();

  touchFile(path, function() {
    deferred.resolve();
  });

  return deferred.promise;
}

//////////////////////////////

function recurseDirectory(accumulator, dir, opt) {
  void 0;
  var deferred = q.defer();

  fs.readdir(dir, function(err, files) {
    var i,
        promises = [];

    void 0;

    for (i = 0; i < files.length; i++) (function(i) {
      var file = files[i],
          filePath = path.join(dir, file),
          innerDeferred = q.defer();

      promises.push(innerDeferred.promise);

      fs.stat(filePath, function(err, stats) {
        if (stats.isDirectory()) {
          accumulator[file] = {};
          recurseDirectory(accumulator[file], filePath, opt).then(function() {
            innerDeferred.resolve();
          });
        } else {
          accumulator[file] = '';
          innerDeferred.resolve();
        }
      });
    })(i);

    q.all(promises).then(function() {
      deferred.resolve(accumulator);
    });

  });

  return deferred.promise;
}
'use strict';

var fs = require('fs'),
    tmp = require('tmp'),
    path = require('path'),
    q = require('q'),
    touch = require('touch'),
    dir2obj = require('../index.js').dir2obj,
    constants = require('../index.js').constants,
    tmpDir;

beforeEach(function(next) {
  tmp.dir(function(err, dir) {
    if (err) throw err;

    tmpDir = dir;
    next();
  });
});

afterEach(function() {

});


describe('dir2obj', function() {
  it('should correctly handle empty directories', function(next) {
    dir2obj(tmpDir).then(function(obj) {
      var keys = Object.keys(obj);

      expect(keys.length).toEqual(0);
      next();
    });
  });

  it('should correctly handle directories', function(next) {
    var directories = ['a','b','c'],
        i,
        promises = [];

    for (i = 0; i < directories.length; i++) (function(i) {

      var subDir = path.join(tmpDir, directories[i]),
          deferred = q.defer();

      promises.push(deferred.promise);
      fs.mkdir(subDir, function(err) {
        if (err) throw err;

        deferred.resolve();
      });
    })(i);

    q.all(promises).then(function() {
      dir2obj(tmpDir).then(function(obj) {
        var keys = Object.keys(obj),
            j;

        for (j = 0; j < directories.length; j++) {
          expect(obj[directories[j]]).not.toBeUndefined();
          expect(obj[directories[j]]).toEqual(constants.emptyDirectory);
        }

        next();
      });
    });
  });

  it('should correctly handle files', function(next) {
    var files = ['a','b','c'],
        i,
        promises = [];

    for (i = 0; i < files.length; i++) (function () {

      var subPath = path.join(tmpDir, files[i]),
          deferred = q.defer();

      promises.push(deferred.promise);

      touch(subPath, deferred.resolve);

    })(i);

    q.all(promises).then(function() {
      dir2obj(tmpDir).then(function(obj) {
        var keys = Object.keys(obj),
            j;

        for (j = 0; j < files.length; j++) {
          expect(obj[files[j]]).toEqual(constants.file);
        }

        next();
      });
    });
  });

  it('should correctly handle nested files and folders', function(next) {
    var file = 'a',
        folder = 'b',
        outer = 'c',
        promises = [],
        subPath = path.join(tmpDir, outer),
        fileDeferred = q.defer(),
        folderDeferred = q.defer();

    fs.mkdir(subPath, function(err) {
      if (err) throw err;

      touch(path.join(subPath, file), fileDeferred.resolve);
      fs.mkdir(path.join(subPath, folder), folderDeferred.resolve);
    });

    q.all([fileDeferred, folderDeferred]).then(function() {
      dir2obj(tmpDir).then(function(obj) {
        expect(obj[outer]).not.toBeUndefined();
        expect(obj[outer][file]).toEqual(constants.file);
        expect(obj[outer][folder]).toEqual(constants.emptyDirectory);
        next();
      });
    });

  });

  // todo: handle symlinks
});

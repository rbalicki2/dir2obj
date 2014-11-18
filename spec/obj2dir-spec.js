'use strict';

var fs = require('fs'),
    tmp = require('tmp'),
    path = require('path'),
    q = require('q'),
    touch = require('touch'),
    obj2dir = require('../index.js').obj2dir,
    constants = require('../index.js').constants,
    tmpDir;

beforeEach(function(next) {
  tmp.dir(function(err, dir) {
    if (err) throw err;

    tmpDir = dir;
    next();
  });
});


describe('obj2dir', function() {

  it('should create directories', function(next) {
    var obj = {
          a: {},
          b: {}
        },
        deferred = [
          q.defer(),
          q.defer()
        ],
        promises = [
          deferred[0].promise,
          deferred[1].promise,
        ];

    obj2dir(obj, tmpDir).then(function() {
      fs.stat(path.join(tmpDir, 'a'), function(err, stats) {
        expect(stats.isDirectory()).toEqual(true);
        deferred[0].resolve();
      });

      fs.stat(path.join(tmpDir, 'b'), function(err, stats) {
        expect(stats.isDirectory()).toEqual(true);
        deferred[1].resolve();
      });
    });

    q.all(promises).then(function() {
      next();
    });

  });

  it('should create files', function(next) {
    var obj = {
          a: '',
          b: ''
        },
        deferred = [
          q.defer(),
          q.defer()
        ],
        promises = [
          deferred[0].promise,
          deferred[1].promise,
        ];

    obj2dir(obj, tmpDir).then(function() {
      fs.stat(path.join(tmpDir, 'a'), function(err, stats) {
        expect(stats.isFile()).toEqual(true);
        deferred[0].resolve();
      });

      fs.stat(path.join(tmpDir, 'b'), function(err, stats) {
        expect(stats.isFile()).toEqual(true);
        deferred[1].resolve();
      });
    });

    q.all(promises).then(function() {
      next();
    });

  });

  it('should handle nested files and directories', function(next) {

    var obj = {
          a: {
            b: '',
            c: {}
          },
        },
        deferred = [
          q.defer(),
          q.defer()
        ],
        promises = [
          deferred[0].promise,
          deferred[1].promise,
        ];

    obj2dir(obj, tmpDir).then(function() {
      fs.stat(path.join(tmpDir, 'a/b'), function(err, stats) {
        expect(stats.isFile()).toEqual(true);
        deferred[0].resolve();
      });

      fs.stat(path.join(tmpDir, 'a/c'), function(err, stats) {
        expect(stats.isDirectory()).toEqual(true);
        deferred[1].resolve();
      });
    });

    q.all(promises).then(function() {
      next();
    });

  });

  // TODO: handle collisions, permissions, etc.
  // test for no extraneous files or directories
});
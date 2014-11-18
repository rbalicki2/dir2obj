# Dir2Obj

> Node package for turning directory structures into plain ol' Javascript objects and vice versa.

*Issues should be reported on the [issue tracker](https://github.com/rbalicki2/dir2obj/issues).*

**dir2obj** is intended as a complement to git for boilerplate projects.

git ignores empty directories and empty files (see [here](http://stackoverflow.com/questions/115983/add-empty-directory-to-git-repository)). This presents a problem when creating project boilerplates. Should you create dummy files in required directories and have the user delete these files, or have the end user learn about the required directories and create them?

**dir2obj** is an easy, light-weight solution for creating directory structures and empty files. See below for example uses.

## Installation

```sh
npm install --save-dev dir2obj
```

## Example usage

In your boilerplate's gulpfile:

```js
var gulp = require('gulp'),
    dir2obj = require('dir2obj'),
    directoryStructure = require('../dev/directory-structure.json');

gulp.task('create-dirs', function(cb) {
  dir2obj(directoryStructure).then(function() {
    cb();
  });
});
```

And on the command line 

```
git clone [your repo]
npm install
gulp create-dirs
```

## API

### dir2obj.dir2obj(dir, opt)

Returns: `promise`

This promise resolves with an object representation of the directory. Files are empty strings and folders are directories.

#### dir

Type: `string`  
Default: `.`

Directory to recurse.

#### opt

Type: `object`  
Default: `{}`

Ignored for now. Will be fleshed out soon.

### dir2obj.obj2dir(obj, dir, opt)

Returns: `promise`

This promise resolves when the directory structure has been created.

#### obj

Type: `object`  
Default: `{}`

The object, with objects being turned into directories and everything else being turned into files.

#### dir

Type: `string`  
Default: `.`

The directory into which to touch files and create directories.

#### opt

Type: `object`  
Default: `{}`

Ignored for now. Will be fleshed out soon with configuration settings for handling errors, etc.

### dir2obj.constants

#### dir2obj.constants.emptyDirectory

Value: `{}`

#### dir2obj.constants.file

Value: `''`

## To do

* Better exception handling (symlinks, files existing, etc.)
* More config options
* Command line options

## License

MIT
# generator-secure-data [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Encrypt the secure data and wrap it into the module

## Installation

First, install [Yeoman](http://yeoman.io) and `generator-secure-data`
using [npm](https://www.npmjs.com/) (we assume you have pre-installed
[node.js](https://nodejs.org/)).

```sh
npm install -g yo
npm install -g generator-secure-data
```

All prompts may be skipped if command line args is provided.

# Usage

It is well known that keeping passwords in plain text is bad.
When application is require to integrate secure data, for example
API keys, passwords, etc - it is same things. Application itself
is a plain data. And secure data in it must be crypted.

This generator require file with secure data and generate
module which contain such secure data in packed crypted form:

```
secure-data.json --> [yo secure-data] --> cipher.js
```

To generate your secure data module (args avaialble):

```sh
$ yo secure-data
```

So you just need to import function from this module and call
it with a password and receive result (wrapped in promise):

```js
const cipher = require('cipher.js')
cipher('password').then( result => {
  console.log(result.key)
})

// or with async/await
console.log(await cipher('password'))
```

# Command line args

Command line args is available

```sh
yo secure-data [options] [<data>] [<module>] [<password>]
```

```
Options:
  -h,   --help          # Print the generator's options and usage
        --skip-cache    # Do not remember prompt answers              (false)
        --skip-install  # Do not automatically install dependencies   (false)
        --json          # Parse json after decrypt (incompatible with --raw)
        --raw           # Return raw data after decrypt (incompat with --json)
        --remove        # Remove destination module path before output

Arguments:
  data      # Input data file path       Type: String  Required: false
  module    # Output module to generate  Type: String  Required: false
  password  # Password used to encrypt   Type: String  Required: false
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Serguei Okladnikov](https://github.com/oklas)


[npm-image]: https://badge.fury.io/js/generator-secure-data.svg
[npm-url]: https://npmjs.org/package/generator-secure-data
[travis-image]: https://travis-ci.org/oklas/generator-secure-data.svg?branch=master
[travis-url]: https://travis-ci.org/oklas/generator-secure-data
[daviddm-image]: https://david-dm.org/oklas/generator-secure-data.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/oklas/generator-secure-data
[coveralls-image]: https://coveralls.io/repos/oklas/generator-secure-data/badge.svg
[coveralls-url]: https://coveralls.io/r/oklas/generator-secure-data

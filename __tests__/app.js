'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const secureFile = './secure-data.json';
const dataPath = path.join(__dirname, secureFile);
const modulePath = './secure-data.js';
const password = 'test-&@%-pass';

describe('generator-secure-data:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      dataPath: dataPath,
      modulePath: modulePath,
      password: password,
      json: true
    });
  });

  it('creates files', () => {
    assert.file([modulePath]);
    assert.fileContent(modulePath, /"secret":.*"pass"/);
  });
});

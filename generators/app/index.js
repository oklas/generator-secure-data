'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const cryptData = require('./crypt-data');

function generatePassword(len) {
  const chars = (
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
    '0123456789!@#$%^&*()-_=+[]{}:;/|,.<>?~'
  ).split('');
  return Array(len)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('data', {
      desc: 'Input data file path',
      type: String,
      required: false
    });

    this.argument('module', {
      desc: 'Output module to generate',
      type: String,
      required: false
    });

    this.argument('password', {
      desc: 'Password used to encrypt',
      type: String,
      required: false
    });

    this.option('json', {
      desc: 'Parse json after decrypt (incompatible with --raw)'
    });

    this.option('raw', {
      desc: 'Return raw data after decrypt (incompatible with --json)'
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the breathtaking ' +
          chalk.red('generator-secure-data') +
          ' generator!'
      )
    );

    const prompts = [];

    if (!this.options.data)
      prompts.push({
        type: 'input',
        name: 'dataPath',
        message: 'Specify input data file path',
        default: this.options.data || 'src/sequre-data.json'
      });

    if (!this.options.module)
      prompts.push({
        type: 'input',
        name: 'modulePath',
        message: 'Specify output module to generate',
        default: this.options.module || 'src/sequre-data.js'
      });

    if (!this.options.password)
      prompts.push({
        type: 'input',
        name: 'password',
        message: 'Password used to encrypt',
        default: this.options.password || generatePassword(10)
      });

    if (!this.options.json && !this.options.raw)
      prompts.push({
        type: 'confirm',
        name: 'parseJson',
        message: 'Would you like to parse json after decrypt?',
        default: this.options.json
      });

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.parseJson = props.parseJson || this.options.json;
      props.password = props.password || this.options.password;
      props.modulePath = props.modulePath || this.options.module;
      props.dataPath = props.dataPath || this.options.data;
      this.props = props;
    });
  }

  writing() {
    const done = this.async();

    const task = {
      password: this.props.password,
      dataPath: this.props.dataPath,
      json: this.props.parseJson
    };

    cryptData(task, (err, task) => {
      if (err) return done(err);

      this.fs.copyTpl(
        this.templatePath('secure-module.js'),
        this.destinationPath(this.props.modulePath),
        task
      );
      done();
    });
  }

  install() {
    this.installDependencies();
  }
};

'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var getRootDir = require('../helpers/get-root-dir');
var path = require('path');

var FilterGenerator = module.exports = function FilterGenerator() {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  var fileJSON = this.config.get('config');

  // options
  this.projectName = fileJSON.projectName;
  this.jsFramework = fileJSON.jsFramework;
  this.testFramework = fileJSON.testFramework;
  this.useTesting = fileJSON.useTesting;

};

util.inherits(FilterGenerator, yeoman.generators.NamedBase);

// Prompts
FilterGenerator.prototype.ask = function ask() {
  if (this.jsFramework !== 'angular') {
    this.log('This subgenerator is only used for Angular Applications. It seems as though you are not using Angular');
    this.log('Operation aborted');
    this.abort = true;
    return;
  }

  var done = this.async();
  var prompts = [{
    name: 'filterFile',
    message: 'Where would you like to create this filter?',
    default: 'client/app'
  }];

  this.prompt(prompts, function(answers) {
    // Get root directory
    this.rootDir = getRootDir(answers.filterFile);
    this.filterFile = path.join(
        answers.filterFile,
        this._.slugify(this.name.toLowerCase()),
        this._.slugify(this.name.toLowerCase())
      );
    this.testFile = path.join(
        answers.filterFile,
        this._.slugify(this.name.toLowerCase()),
        this._.slugify(this.name.toLowerCase())
      );

    done();
  }.bind(this));
};

FilterGenerator.prototype.files = function files() {
  if (this.abort) {
    return;
  }

  this.template('filter.js', this.filterFile + '.filter.js');

  if (this.useTesting) {
    this.template('filter.spec.js', this.testFile + '.filter.spec.js');
  }

};

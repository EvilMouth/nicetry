'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const _ = require('lodash');

function fuckCompanyDomain(companyDomain) {
  let packagePR = '';
  let split = companyDomain.split('.');
  for (let i = split.length - 1; i >= 0; i--) {
    if (packagePR !== '') {
      packagePR += '.';
    }
    packagePR += split[i];
  }
  return packagePR;
}

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the good ' + chalk.red('generator-newproject') + ' generator!'
    ));

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname.replace(/ /g, '-') // Default to current folder
      },
      {
        type: 'input',
        name: 'companyDomain',
        message: 'Your company domain(zyhang.com)',
        default: 'zyhang.com'
      },
      {
        type: 'input',
        name: 'minSdk',
        message: 'Minimum SDK(16)',
        default: 16
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author(zyhang)',
        default: 'zyhang'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.log(
      'creating new project...'
    );
    mkdirp(this.props.projectName);
    this.destinationRoot(this.destinationPath(this.props.projectName));

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    let buildTpl = _.template(this.fs.read(this.templatePath('build.gradle')));
    this.fs.write(this.destinationPath('build.gradle'), buildTpl({
      minSdk: this.props.minSdk
    }));

    this.fs.copy(
      this.templatePath('gradle.properties'),
      this.destinationPath('gradle.properties')
    );

    this.fs.copy(
      this.templatePath('settings.gradle'),
      this.destinationPath('settings.gradle')
    );

    this.log(
      'creating app...'
    );
    mkdirp('app');
    this.destinationRoot(this.destinationPath('app'));

    let appBuildTpl = _.template(this.fs.read(this.templatePath('app/build.gradle')));
    this.fs.write(this.destinationPath('build.gradle'), appBuildTpl({
      projectName: this.props.projectName,
      companyDomain: fuckCompanyDomain(this.props.companyDomain),
      minSdk: this.props.minSdk
    }));

    this.fs.copy(
      this.templatePath('app/gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('app/proguard-rules.pro'),
      this.destinationPath('proguard-rules.pro')
    );

    this.log(
      'creating src...'
    );
    mkdirp('libs');
    mkdirp('src');
    this.destinationRoot(this.destinationPath('src'));

    this.log(
      'creating main...'
    );
    mkdirp('main');
    this.destinationRoot(this.destinationPath('main'));

    let manifestTpl = _.template(this.fs.read(this.templatePath('app/src/main/AndroidManifest.xml')));
    this.fs.write(this.destinationPath('AndroidManifest.xml'), manifestTpl({
      projectName: this.props.projectName,
      companyDomain: fuckCompanyDomain(this.props.companyDomain)
    }));

    this.fs.copy(
      this.templatePath('app/src/main/res'),
      this.destinationPath('res')
    );
    mkdirp('res/drawable');
    mkdirp('res/drawable-hdpi');
    mkdirp('res/drawable-mdpi');
    mkdirp('res/drawable-nodpi');
    mkdirp('res/drawable-xhdpi');
    mkdirp('res/drawable-xxhdpi');
    mkdirp('res/drawable-xxxhdpi');

    this.log(
      'creating java...'
    );
    mkdirp('java');
    this.destinationRoot(this.destinationPath('java'));

    let packagePR = fuckCompanyDomain(this.props.companyDomain);
    let split = packagePR.split('.');
    for (let i = 0, length = split.length; i < length; i++) {
      mkdirp(split[i]);
      this.destinationRoot(this.destinationPath(split[i]));
    }
    mkdirp(this.props.projectName);
    this.destinationRoot(this.props.projectName);

    let mainActivityTpl = _.template(this.fs.read(this.templatePath('app/src/main/java/MainActivity')));
    this.fs.write(this.destinationPath('MainActivity.java'), mainActivityTpl({
      projectName: this.props.projectName,
      companyDomain: fuckCompanyDomain(this.props.companyDomain),
      author: this.props.author
    }));
  }
};

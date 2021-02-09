const Parser = require('junitxml-to-javascript');
const path = require('path');
const fg = require('fast-glob');

const branch = process.argv[3] || 'branch';
const username = process.argv[2] || branch;
let numSuites = 0;
const passedSuites = [];
const failedSuites = [];

/**
 * Determine how many test files passed and output to console.
 * This can be extended to send the same data elsewhere, ex: slack, LMS
 */

const passed = (suite) => suite.succeeded === suite.tests;

const parseAllFiles = async () => {
  const glob = __dirname + '/../reports/junit/junit-*.xml';
  const fileNames = fg.sync(glob);
  numSuites = fileNames.length;

  for (const file of fileNames) {
    const report = await new Parser().parseXMLFile(file);
    const { testsuites } = report;

    let testFilePassed = testsuites.every((ts) => passed(ts));

    if (testFilePassed) {
      passedSuites.push(testsuites[0].name);
    } else {
      let failed = testsuites.filter((ts) => !passed(ts));
      failedSuites.push(failed[0].name);
    }
  }

  if (passedSuites.length === numSuites) {
    notifyPass(username, numSuites);
  } else {
    notifyFail(username, numSuites, passedSuites, failedSuites);
  }
};

const notifyPass = (username, numSuites) => {
  console.log(`Yay! ${username} passed all ${numSuites} tests!`);
};

const notifyFail = (username, numSuites, passedSuites, failedSuites) => {
  console.log(`${passedSuites.length} / ${numSuites} passed for ${username}`);
  console.log('Failing tests:');
  failedSuites.forEach((name) => console.log(name));
};

parseAllFiles();

"use strict";

module.exports = core;

const pkg = require("../package.json");
const log = require("@imooc-cli-dev-x1/log");

function core() {
  // TODO
  checkPkgVersion();
  console.log("core--11:=core ");
}
function checkPkgVersion() {
  console.log(pkg.version);
  log();
}

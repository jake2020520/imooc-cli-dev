"use strict";
const log = require("@imooc-cli-dev-x1/log");
const Package = require("@imooc-cli-dev-x1/package");

const SETTINGS = {
  init: "@imooc-cli-dev-x1/init",
};

function exec() {
  const targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  log.verbose("targetPath: ", targetPath);
  log.verbose("homePath: ", homePath);
  // TODO

  const cmdObj = arguments[arguments.length - 1];

  //   console.log("arguments: ", arguments);
  console.log("arguments: ", cmdObj._name);
  const cdmName = cmdObj.name();
  console.log("arguments:cdmName ", cdmName);
  const packageName = SETTINGS[cdmName];
  const packageVersion = "latest";
  // 目标路径不存在，生成缓存路径
  if (!targetPath) {
    // 生成缓存路径
    targetPath = "";
  }
  const pkg = new Package({
    targetPath: targetPath,
    packageName,
    packageVersion,
  });
  console.log("==========exec======", pkg.getRootFilePath());
}

module.exports = exec;

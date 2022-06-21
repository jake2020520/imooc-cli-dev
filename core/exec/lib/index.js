"use strict";
const path = require("path");
const log = require("@imooc-cli-dev-x1/log");
const Package = require("@imooc-cli-dev-x1/package");

const SETTINGS = {
  // init: "@imooc-cli-dev-x1/init",
  init: "@imooc-cli/init",
};

const CACHE_DIR = "dependencies/";

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = "",
    pkg;

  // TODO

  const cmdObj = arguments[arguments.length - 1];

  const cdmName = cmdObj.name(); //cmdObj._name 也可以取到
  console.log("arguments:cdmName ", cdmName); // init
  const packageName = SETTINGS[cdmName];
  const packageVersion = "latest";
  // const packageVersion = "1.1.0";

  // 目标路径不存在，生成缓存路径
  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR);
    storeDir = path.resolve(targetPath, "node_modules");
    log.verbose("targetPath:no ", targetPath);
    log.verbose("storeDir: ", storeDir);
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    });
    if (await pkg.exists()) {
      // 更新
      console.log("更新package: --", await pkg.exists());
      await pkg.update();
    } else {
      // 安装
      console.log("按照package: --");
      await pkg.install();
    }
  } else {
    log.verbose("targetPath:yes ", targetPath);
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    });
  }

  const rootFile = pkg.getRootFilePath();
  console.log(111111, rootFile);
  if (rootFile) {
    // console.log("---arguments--", arguments);
    require(rootFile)(Array.from(arguments));
  }

  // log.verbose("targetPath: ", targetPath);
  // log.verbose("homePath: ", homePath);
  // log.verbose("homePath: ", homePath);
}

module.exports = exec;

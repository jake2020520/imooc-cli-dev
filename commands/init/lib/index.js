"use strict";
const fs = require("fs");
const inquirer = require("inquirer");
const fse = require("fs-extra");
const log = require("@imooc-cli-dev-x1/log"); // 颜色
const Command = require("@imooc-cli-dev-x1/command");
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    this.force = !!this._cmd.force;
    log.verbose("projectName: ", this.projectName);
    log.verbose("force: ", this.force);
  }
  async exec() {
    console.log("-init 的业务逻辑-1-");
    try {
      // 1.准备阶段
      await this.prepare();
      // 2.下载模板
      // 3.安装模板
    } catch (e) {
      log.error(e.message);
    }
  }
  async prepare() {
    // 1. 判断当前目录是否为空
    const localPath = process.cwd(); // 执行命名 所在路径
    if (!this.isDirEmpty(localPath)) {
      let ifContinue = false;
      if (!this.force) {
        // 询问是否继续创建
        ifContinue = (
          await inquirer.prompt([
            {
              type: "confirm",
              name: "ifContinue",
              default: false,
              message: "当前文件夹不为空，是否继续创建项目？",
            },
          ])
        ).ifContinue;
        if (!ifContinue) {
          return;
        }
      }

      if (ifContinue || this.force) {
        // 二次确认
        const { confirmDelete } = await inquirer.prompt({
          type: "confirm",
          name: "confirmDelete",
          default: false,
          message: "是否清空当前目录下的文件？",
        });
        // 清空当前目录
        console.log(
          "--------清空当前目录下的文件--confirmDelete-----",
          confirmDelete
        );
        if (confirmDelete) {
          console.log("--------清空当前目录下的文件-------");
          // fse.emptyDirSync(localPath);
        }
      }
    } else {
      // 直接
    }
    // 2.是否启动强制更新
    // 3.选择创建项目和组件
    // 4.获取项目的基本信息
    //
  }
  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);
    // 文件过滤的逻辑
    fileList = fileList.filter(
      (file) => !file.startsWith(".") && ["node_modules"].indexOf(file) < 0
    );
    console.log("isCwdEmpty:00 ", fileList);
    return !fileList || fileList.length <= 0;
  }
}
function init(argv) {
  // TODO
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;

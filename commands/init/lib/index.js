"use strict";
const fs = require("fs");
const path = require("path");
const userHome = require("user-home");
const inquirer = require("inquirer");
const semver = require("semver"); // 版本号对比
const fse = require("fs-extra");
const log = require("@imooc-cli-dev-x1/log"); // 颜色
const Command = require("@imooc-cli-dev-x1/command");
const Package = require("@imooc-cli-dev-x1/package");

const getProjectTemplate = require("./getProjectTemplate");

const TYPE_PROJECT = "project";
const TYPE_COMPONENT = "component";
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    this.force = !!this._cmd.force;
    log.verbose("projectName: ", this.projectName);
    log.verbose("force: ", this.force);
  }
  async exec() {
    try {
      // 1.准备阶段
      const projectInfo = await this.prepare();
      log.verbose("projectInfo: ", projectInfo);
      if (projectInfo) {
        this.projectInfo = projectInfo;
        // 2.下载模板
        await this.downLoadTemplate();
        // 3.安装模板
      }
    } catch (e) {
      log.error(e.message);
    }
  }

  async downLoadTemplate() {
    console.log("downLoadTemplate info: ", this.template, this.projectInfo);
    const { projectTemplate } = this.projectInfo;
    const templateInfo = this.template.find(
      (template) => template.npmName === projectTemplate
    );
    const targetPath = path.resolve(userHome, ".imooc-cli-dev", "template");
    const storeDir = path.resolve(
      userHome,
      ".imooc-cli-dev",
      "template",
      "node_modules"
    );
    console.log("--downLoadTemplate-", targetPath, storeDir);
    const { npmName, version } = templateInfo;
    const templateNpm = new Package({
      targetPath,
      storeDir,
      packageName: npmName,
      packageVersion: version,
    });
    if (!templateNpm.exists()) {
      await templateNpm.install();
    } else {
      await templateNpm.update();
    }
    // 1.通过项目模板api获取项目模板信息
    // 2.通过egg.js搭建一套后端系统
    // 3. 通过npm存储项目模板
    // 4.将项目模板信息存储到mongodb数据库中
    // 5.通过egg.js获取mongodb中的数据并且通过api返回
    //
    //
  }

  async prepare() {
    // 0. 判断模板是否存在 数据中获取
    const template = await getProjectTemplate();
    if (!template || template.length === 0) {
      throw new Error("项目模板不存在");
    }
    this.template = template;
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
      // 2.是否启动强制更新
      if (ifContinue || this.force) {
        // 二次确认
        const { confirmDelete } = await inquirer.prompt({
          type: "confirm",
          name: "confirmDelete",
          default: false,
          message: `是否清除路径为${localPath}下的所有文件`,
        });
        if (confirmDelete) {
          // 清空文件夹的操作
          // fse.emptyDirSync(localPath);
        }
      }
    }
    return this.getProjectInfo();
  }
  async getProjectInfo() {
    let projectInfo = {};
    // 1.选择创建项目和组件
    const { type } = await inquirer.prompt({
      type: "list",
      name: "type",
      message: "请选择初始化类型",
      default: TYPE_PROJECT,
      choices: [
        { name: "项目", value: TYPE_PROJECT },
        { name: "组件", value: TYPE_COMPONENT },
      ],
    });
    log.verbose("type", type);
    if (type === TYPE_PROJECT) {
      // 2.获取项目的基本信息
      const project = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          default: "",
          validate: function (v) {
            // 1.输入的首位字符
            // 2.尾字符必须为英文字符或者数字，不能为字符
            // 3. 字符仅允许“-_”
            const done = this.async();
            // Do async stuff
            setTimeout(function () {
              if (
                !/^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(
                  v
                )
              ) {
                // Pass the return value in the done callback
                done("请输入合法的项目名称，例:a1_a1_a1");
                return;
              }
              // Pass the return value in the done callback
              done(null, true);
            }, 0);
          },
          filter: function (v) {
            return v;
          },
        },
        {
          type: "input",
          name: "projectVersion",
          message: "请输入版本号",
          default: "1.0.0",
          validate: function (v) {
            const done = this.async();

            // Do async stuff
            setTimeout(function () {
              if (!!!semver.valid(v)) {
                // Pass the return value in the done callback
                done("请输入合法的版本号,例如：1.1.0");
                return;
              }
              // Pass the return value in the done callback
              done(null, true);
            }, 0);
            return;
          },
          filter: function (v) {
            if (!!semver.valid(v)) {
              return semver.valid(v);
            } else {
              return v;
            }
          },
        },
        {
          type: "list",
          name: "projectTemplate",
          message: "请选择项目模板",
          choices: this.createTemplateChoice(),
        },
      ]);
      projectInfo = { type, ...project };
    } else if (type === TYPE_COMPONENT) {
    }
    return projectInfo;
    //
  }

  createTemplateChoice() {
    const data = this.template.map((item) => ({
      value: item.npmName,
      name: item.name,
    }));
    return data;
  }

  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);
    // 文件过滤的逻辑
    fileList = fileList.filter(
      (file) => !file.startsWith(".") && ["node_modules"].indexOf(file) < 0
    );
    // console.log("isCwdEmpty:00 ", fileList);
    return !fileList || fileList.length <= 0;
  }
}
function init(argv) {
  // TODO
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;

"use strict";
const log = require("@imooc-cli-dev-x1/log"); // 颜色
const Command = require("@imooc-cli-dev-x1/command");
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    this.force = !!this._cmd.force;
    log.verbose("projectName: ", this.projectName);
    log.verbose("force: ", this.force);
  }
  exec() {
    console.log("-init 的业务逻辑-");
  }
}
function init(argv) {
  // TODO
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;

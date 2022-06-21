"use strict";

const Command = require("@imooc-cli-dev-x1/command");
class InitCommand extends Command {}
function init(argv) {
  // TODO

  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;

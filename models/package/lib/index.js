"use strict";
const npminstall = require("npminstall");
const path = require("path");
const pkgDir = require("pkg-dir").sync; // 找到 项目里面的package.json
const { isObject } = require("@imooc-cli-dev-x1/utils");
const formatPath = require("@imooc-cli-dev-x1/format-path");
class Package {
  constructor(options) {
    if (!options) {
      throw new Error("package类的options 参数不能为空");
    }
    console.log("package constructor", options);
    if (!isObject(options)) {
      throw new Error("package类的options 必须为对象");
    }
    // package的目标路径
    this.targetPath = options.targetPath;
    // // package的存储路径
    // this.storePath = options.storePath;
    // package的name
    this.packageName = options.packageName;
    // package的version
    this.packageVersion = options.packageVersion;
  }
  /**
   * @description 判断当前package是否存在
   */
  exists() {}
  /**
   * @description 按照package
   */
  install() {
    npminstall({
      root: path.resolve(__dirname, "../../111"),
      storeDir: path.resolve(__dirname, "../../111", "node_modules"),
      registry: "https://registry.npmjs.org",
      pkgs: [{ name: "foo", version: "~1.0.0" }],
    });
  }
  /**
   * @description 更新package
   */
  update() {}
  /**
   * @description 获取入口文件的路径
   */
  getRootFilePath() {
    // 1、获取package.json所在目录
    const dir = pkgDir(this.targetPath);
    if (dir) {
      // 2、读取 package.json
      const pkgFile = require(path.resolve(dir, "package.json"));
      // 3、寻找main/lib
      if (pkgFile && pkgFile.main) {
        // 4、路径的兼容(macOs/windows)
        console.log("getRootFilePath: ", path.resolve(dir, pkgFile.main));
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }
    return null;
  }
}

module.exports = Package;

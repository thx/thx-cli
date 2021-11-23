<div align="center">
  <a href="">
    <!-- <img width="200" height="200" src="./packages/server/assets/favicon.svg" /> -->
    <img width="200" height="200" src="//img.alicdn.com/tfs/TB10M8q4YY1gK0jSZTEXXXDQVXa-128-128.svg" />
  </a>
  <!-- <h1>webpack.js.org</h1> -->
  <!-- Guides, documentation, and all things webpack. -->
</div>

# MM CLI
命令行工具 + 一站式智能研发工作台。

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![](https://img.shields.io/badge/scripts-mm%20dev-brightgreen)
![](https://img.shields.io/badge/monorepo-lerna-brightgreen)

## 快速开始

```sh
tnpm i -g @ali/mm-cli
mm install kit @ali/mm-kit-react
mm install kit @ali/mm-kit-magix
mm install kit @ali/mm-kit-dev
mm --help
```

## Packages
* [packages/command](./packages/command) 命令行工具。
* [packages/webui](./packages/webui) 本地研发工作台。
* [packages/playground](./packages/playground) 游乐场。

## 本地开发
```sh
# 1. 设置 yarn 源，并安装依赖
yarn config set registry https://registry.npm.alibaba-inc.com
yarn config set sass_binary_site https://web.npm.alibaba-inc.com/mirrors/node-sass/
yarn run bootstrap

# 2. 启动本地编译，并自动打开工作台
yarn run dev

# 2.1 或者，启动本地开发相关的所有任务，包括：启动本地编译、链接本地仓库到全局、启动测试用例、启动文档生成工具、启动依赖分析工具
yarn run dev:mece

# 2.2 或者，只编译指定包，执行下面这行命令后，将只启动 packages/command 和 packages/core 两个目录的本地编译
yarn run dev --scope @ali/mm-cli --scope @ali/mm-cli-core

# 3. 进入专属的调试目录
cd packages/playground

# 4. 执行初始化（初始化一个应用，例如项目名 foo)
npx mm init

# 5. 或者，手动启动工作台

## 5.1 进入应用目录，手动启动工作台
cd foo
npx mm web

## 5.2 或者，调试一个新工作台
MM_MODE=development npx mm web --port 7878 
```

## 查看日志
```sh
tail -f ~/.mm/logs/@ali/*.log
## 或者用 Mac Console.app 查看
open /Applications/Utilities/Console.app ~/.mm/mm-debug*.log
```


## 测试用例
```sh
# 执行一次测试用例
yarn run test
# 执行测试用例， 并监听文件变化
yarn run test:watch
```

如果是新目录（包），请先安装依赖的测试工具：
```sh
lerna add nodemon ts-node mocha @types/mocha chai @types/chai packages/<package> --dev
## 或者
lerna add nodemon       packages/<package> --dev
lerna add ts-node       packages/<package> --dev
lerna add mocha         packages/<package> --dev
lerna add @types/mocha  packages/<package> --dev
lerna add chai          packages/<package> --dev
lerna add @types/chai   packages/<package> --dev

```

## 发布

> 注意：请必须先全局安装 [@ali/lerna](https://web.npm.alibaba-inc.com/package/@ali/lerna)，再执行发布。

> `yarn global add @ali/lerna`

```sh
lerna publish
# 预发布
lerna publish prerelease --loglevel verbose
# 查看详细日志
lerna publish --loglevel verbose
# 逐个单独发布
lerna exec -- tnpm publish
```

### 测试版发布
```sh
git checkout master
git merge refactor_playground
git push
lerna version prerelease --no-private --no-commit-hooks --message prerelease --loglevel verbose
lerna exec --parallel --no-bail --no-private --loglevel verbose -- tnpm publish
```

## FAQ

### WHY NOT MAGIX CLI, WHY MM CLI ?
0. 一致的工程体验
  * 向上抽象：工程框架、React 套件、Magix 套件、Cell 套件。
  * 向下沉淀：工具包、单体插件。
1. 更好的工程体验
  * 驱动方式：单任务 => 多任务
  * 交互方式：命令行 CLI 文字交互 => 人性化 GUI 图形交互
  * 学习方式：记指令 => 点一点
2. 一站式的前端研发工作台 
  * CLI + 工作台
  * 研发全链路覆盖
  * 研发全链路可视化
  * 研发技术栈无关
  * 强大的扩展能力，通过插件和套件定制各种能力
  * 项目管理、项目开发、妈妈生态打通
3. 无所不能的套件
  * 支持添加新的命令
  * 支持扩展已有命令
  * 支持对指定类型的项目进行命令重写
  * 支持添加脚手架
  * 支持扩展 WebUI 界面
  * 支持扩展 WebUI 内置服务
  * 支持添加和管理后台服务
  * 支持通过界面管理自定义设置

### WHY NOT RMX CLI V1, WHY MM CLI V2 ?

0. 重复大量腐烂代码，例如，包结构不合理，代码架构不合理，代码结构不合理，模块、方法、变量的命名不合理，重复代码、过期依赖包，等等。
1. 修复大量异常和错误。
2. 基于 TS 重写，补齐测试用例，更安全。
3. 更友好、更丰富的提示信息，更好看的 CLI 主题。
4. 更好用、更好看的本地研发工作台，更简洁、更安全的任务管理方案，更规范的任务通信方式。
5. 更合理的产品架构、更内聚的代码实现，全面升级依赖包，方便面向未来迭代。
6. 扩展更多命令。
  * mm remote
  * mm install kit <package>
  * mm install plugin <package>
  * mm list --json
  * mm dev --list
  * 等等。

### 为什么不是 DEF 套件，而是 MM CLI 套件

首先，迭代管理、代码 CDN 发布，依然基于 DEF 云构建、构建器。

但是，联盟还有更多 DEF 覆盖不到的场景：
1. 发布物料更复杂，包括代码、ALP 组件、TNPM 包、ALP（HTML 源码、跨域接口、纯 JSON）。
2. 发布渠道不满足要求，需要支持 CDN、TNPM、ALP、前端灰度环境、后端灰度环境。
3. 版本管理不满足要求，需要支持 Diamond、Switch、自研版本管理平台、自定义发布范围。
4. 底层能力不满足要求，需要支持更多效率工具接入（特别是初始化）、支持多任务管理、支持 WebUI 及其扩展。


### 为什么使用全局命令，而不是 `npm run dev` 这种应用命令？

1. 应用命令是固定的，不方便传递参数，例如按需构建 `mm dev foo,bar`。
2. 可用的命令不只 `dev`、`build`。

### 为什么安装依赖那么慢？

试试先执行下面的脚本：
```sh
yarn config set registry https://registry.npm.alibaba-inc.com
yarn config set sass_binary_site https://web.npm.alibaba-inc.com/mirrors/node-sass/
```

再次运行 `yarn` 的耗时对比：

* 无任务配置：282.87s
* 配置 npm 源：232.01s
* 配置 sass 二进制文件镜像：7.08s

### 怎么避免提交校验？

```sh
# 禁用提交校验
git commit -m 'message' --no-verify
```

## Contributors(6)

Ordered by date of first contribution, by [ali-contributors](https://gitlab.alibaba-inc.com/node/ali-contributors).

- <a target="_blank" href="https://work.alibaba-inc.com/work/u/88075"><img style="vertical-align: middle;" width="20" src="https://work.alibaba-inc.com/photo/88075.40x40.xz.jpg"> @慧知</a> <a target="_blank" href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=jq3zrj9"><img style="vertical-align: middle;" width="20" src="https://img.alicdn.com/tfs/TB18HtyiyqAXuNjy1XdXXaYcVXa-24-24.svg"> 慧知</a>
- <a target="_blank" href="https://work.alibaba-inc.com/work/u/76585"><img style="vertical-align: middle;" width="20" src="https://work.alibaba-inc.com/photo/76585.40x40.xz.jpg"> @昕雅</a> <a target="_blank" href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=jtz9pi8"><img style="vertical-align: middle;" width="20" src="https://img.alicdn.com/tfs/TB18HtyiyqAXuNjy1XdXXaYcVXa-24-24.svg"> 昕雅</a>
- <a target="_blank" href="https://work.alibaba-inc.com/work/u/87546"><img style="vertical-align: middle;" width="20" src="https://work.alibaba-inc.com/photo/87546.40x40.xz.jpg"> @示源</a> <a target="_blank" href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=hoe9ng5"><img style="vertical-align: middle;" width="20" src="https://img.alicdn.com/tfs/TB18HtyiyqAXuNjy1XdXXaYcVXa-24-24.svg"> 示源</a>
- <a target="_blank" href="https://work.alibaba-inc.com/work/u/50763"><img style="vertical-align: middle;" width="20" src="https://work.alibaba-inc.com/photo/50763.40x40.xz.jpg"> @崇志</a> <a target="_blank" href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=vuop5vn"><img style="vertical-align: middle;" width="20" src="https://img.alicdn.com/tfs/TB18HtyiyqAXuNjy1XdXXaYcVXa-24-24.svg"> 崇志</a>
- <a target="_blank" href="https://work.alibaba-inc.com/work/u/101102"><img style="vertical-align: middle;" width="20" src="https://work.alibaba-inc.com/photo/101102.40x40.xz.jpg"> @栖七</a> <a target="_blank" href="http://amos.im.alisoft.com/msg.aw?v=2&site=cntaobao&s=2&charset=utf-8&uid=%E6%A0%96%E4%B8%83"><img style="vertical-align: middle;" width="20" src="http://amos.alicdn.com/online.aw?v=2&uid=%E6%A0%96%E4%B8%83&site=cntaobao&s=1&charset=utf-8"></a>
- <a target="_blank" href="https://work.alibaba-inc.com/work/u/59071"><img style="vertical-align: middle;" width="20" src="https://work.alibaba-inc.com/photo/59071.40x40.xz.jpg"> @墨智</a> <a target="_blank" href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=y6dx6py"><img style="vertical-align: middle;" width="20" src="https://img.alicdn.com/tfs/TB18HtyiyqAXuNjy1XdXXaYcVXa-24-24.svg"> 墨智</a>

--------------------

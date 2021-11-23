## 1.2.7
- Feat: mm models增加判断RAP平台如果接口被删除或修改的情况，给出提示
- Feat: 增加mm dev --closeHmr配置，临时关闭热更新注入功能
- Feat: 接入云构建
- Feat: 增加jsExtension配置，可配置.es|.ts等，指定mm generate生成的js文件格式\
- Feat: mm init增加自动创建clue项目、自定义监控的功能
- Feat: 支持将magix-combine在控制台的错误信息透出到浏览器端展示
- Feat: mm dev 增加页面注入帮助文档提示
- Feat: mm dev注入magix-desgier相关的js
- Feat: mm magix支持配置magixModuleType，默认为cmd,不再需要手动选择文件


## 1.0.21
- Feat: 增加magixCliConfig.protocolAlias配置，支持接口为http或https的协议
- Feat: mm models增加判断RAP平台如果接口被删除或修改的情况，给出提示
- Feat: 增加mm dev --closeHmr配置，临时关闭热更新注入功能

## 1.0.8
- Feat: matfile, gulpfile, combine-tool-config全部收敛进cli工具内部，以magixCliConfig配置的方式透出，以保持项目未来配置的统一性，同时兼容老的方式

## 0.5.6
- Feat: mm dev 增加判断端口是否被占用
- Feat: mm gallery支持忽略某些组件里的文件被修改提示
- Docs: cli文档迁到github上，[magix-cli-book](https://thx.github.io/magix-cli-book)

## 0.5.1
- Feat: mm init增加自动到gitlab上创建项目功能，无须手动创建(须输入域帐号密码)
- Feat: 增加mm magix命令，安装magix包并同步到项目中
- Feat: 增加mm dev -o [ip]，标识是预发/线上环境，以供magix-hmr注入开发环境全局变量

## 0.4.26
- Feat: 增加mm chartpark命令，同步chartpark平台的图表配置信息到本地
- Fix: mm daily/publish 内含的build构建如果失败中断发布流程
- Fix: 解决request请求rap接口如果是预发环境请求失败的问题

## 0.4.12
- Feat: mm spmlog增加同步数据小站的配置信息到项目中的功能，不再本地维护埋点信息文件
- Refactor: 用npx执行命令替代掉所有的npm run <command>
- Fix: 调整mm generate内置的模板，适配magix3版本

## 0.4.6
1. Refactor: mm daily直接调用alimama-deploy插件，不需要在具体项目中配置依赖
2. Refactor: mm gallery支持直接在package.json里的magixCliConfig里配置组件库版本，无须在dependencies里重复配置
3. Feat: 设置80端口启动服务器的时候给出提示，必须sudo权限执行
4. Feat: mx init可选择脚手架仓库地址配置在alp平台上，不再本地维护
5. Refactor: mx -V -> mx -v
6. Feat: 增加mx magix命令别名，下掉mama命令


## 0.3.25
1. mm gallery支持安装多组件仓库
2. 一些bugfix

## 0.3.13
1. 重构mm gallery命令，移除 mm gallery -f命令，增加 mm gallery时判断是否本地有修改过的组件
2. mm dev增加支持magix-desiger工具，详见 http://gitlab.alibaba-inc.com/thx/magix-desiger

## 0.3.1
1. 增加mm gallery命令，同步magix-gallery组件到本地项目中，详见：http://gitlab.alibaba-inc.com/thx/magix-cli/issues/26

## 0.3.0
1. 增加mm createDaily命令，在master下执行，会自动基于最新的daily分支创建一个+1的daily分支，避免多人同时开发时daily分支互相占用的问题

## 0.2.28
1. 用spawn代替exec优化控制台命令输出
2. 设置exec的maxBuffer值，防止进程经常挂掉
3. package.json -> magixCliConfig增加scriptsInfo列出本地项目可用的任务
4. 优化工具以接入cell四个脚手架
5. 增加mm run <task> 支持运行每个项目自己特定的gulp任务，同时支持grunt/webpack等其他工具
6. mm view -> mm generate 支持生成cell项目相关的模板
7. mm daily/publish 支持 -m 增加提交信息

## 0.2.16
1. mm models完成后若有更新给出git diff 提示

## 0.2.14
1. package.json与本地node_modules版本不一致时提示 tnpm install重新安装包
2. 提示package.json里包版本推荐明确指定详细版本号，以防止包升级带来的不兼容情况

## 0.2.10
1. 命令增加--colors，控制台不再白屏

## 0.2.4
1. 支持mm命令别名，与mama共存
2. 增加版本升级提示，若版本太低，在控制台给出提示
3. mama models rap2 bug修复

## 0.2.1
1. 支持RAP2, 在项目packge.json里配置 `magixCliConfig.rapVerion: "2"` 即可
2. matfile.js里的port, projectId等配置移至package.json的 `magixCliConfig` 统一配置管理

## 0.1.28
1. `mama dev -d x.x.x.x -p 1234` 时指定daily的ip 以及端口号为运行时，而非修改本地matfile文件，以避免冲突  @承虎， http://gitlab.alibaba-inc.com/thx/magix-cli/issues/20

## 0.1.27
1. `mama models` 支持RAP上填  RESTful 风格的接口
2. `mama dev` 80端口需要sudo权限提示

## 0.1.24
1. 自动打开浏览器命令从mama dev 改到matfile.js里执行，保证打开时间的正确性
2. matfile里的port proxyPass等值改为变量，方便其他地方引用
3. `mama models` 生成的models文件加上接口id，方便查看

## 0.1.21
1. `mama dev` 默认打开已存在的chrome标签 

## 0.1.20
1. `mama models` 解析rap接口生成接口name规则变更，以支持 api/test/ 和 api/test 这种细微差别的接口区分 

## 0.1.17
1. `mama dev -d` 时替换本地matfile文件正则用全局匹配，防止页面里有相同的注释掉的地方

## 0.1.15
1. `mama models` 自动生成接口name正则优化
2. `mama dev` 打开的网址可配置在mama_config/config.json里

## 0.1.10
1. `mama models` 支持验证RAP上接口是否重复，并提示
2. `mama models` 生成的接口名称加上接口类型

## 0.1.8
1. `mama view` 判断已存在的文件不再生成
2. `mama models` 支持RAP关联项目加载多个项目接口数据
3. `mama models` 支持本地配置manager.js模板
4. `mama view` 生 成模板支持本地配置
5. 增加项目本地配置mama_config，满足个性化需求

## 0.1.6
1. 用`co` generator优化代码异步结构
2. `mama dev` 服务启动后自动打开浏览器访问
3. 用 `ora` 优化控制台命令输出显示

## 0.0.99
1. 用commander重构命令结构
2. `mama models` 支持指定projectId，`mama models -i 1234`
3. `mama view` 支持指定projectId，`mama view -i 1234`

## 0.0.98
1. `mama view` 支持输入RAP上的接口ID来根据接口字段生成实际可用的模板页面

## 0.0.97
1. `mama models` 只生成所有api集合数组models.js文件，项目中manager.js调用models.js，可以根本需求对接口做特定处理，比如指定某些接口的dataType为jsonp

## 0.0.96
1. 优化manager.js输出支持中文注释

## 0.0.91
1. 修正 `mama models` 解析rap的接口url出错的问题

## 0.0.90
1. `mama init` 没填projectId时，不执行 `mama models` 命令

## 0.0.89
1. 增加 `mama -v|—version` 打印版本号
2. 优化项目压缩代码时出错抛错功能
3. 优化 `mama view` 的tmpl模板内容
4. 优化 `mama view` 输入类型改为选择类型
### Commit Message 格式

```js
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### type的类型

- feat: 新特性
- fix: 修改问题
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理
- perf: 性能优化
- revert: 回滚到某个版本
  
### 其他

- scope: commit 影响的范围, 比如: route, component, utils, build...
- subject: commit 的概述, 建议符合  50/72 formatting
- body: commit 具体修改内容, 可以分为多行, 建议符合 50/72 formatting
- footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.


## 提交
每一次项目上线前，通过 git rebase 把自己的 commit 压缩一下，这样做有两个好处
1. 很大程度上减小 .git 的文件大小
2. 每一次项目的溯源会非常的清晰

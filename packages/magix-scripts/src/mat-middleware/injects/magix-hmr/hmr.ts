/**
 * 利用websocket实现view层级热更新
 *  - 浏览器端websocket服务
 *  - wsPort要与matfile.js里启动的ws服务的端口相同
 *  - 基于seajs模块加载器
 */

export default (wsPort, host, isMagix5) => {
  return `
;
(function () {
    /**
     * Magix HMR 注入代码
     */

    // path.join 浏览器实现
    const CHAR_FORWARD_SLASH = 47
    const CHAR_BACKWARD_SLASH = 92
    const CHAR_DOT = 46
    function isPathSeparator (code) {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH
    }
    function isPosixPathSeparator (code) {
      return code === CHAR_FORWARD_SLASH
    }
    function normalize (path) {
      if (path.length === 0) { return '.' }
      const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH
      const trailingSeparator =
      path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH
      // Normalize the path
      path = normalizeString(path, !isAbsolute, '/', isPosixPathSeparator)
      if (path.length === 0 && !isAbsolute) { path = '.' }
      if (path.length > 0 && trailingSeparator) { path += '/' }
      if (isAbsolute) { return '/' + path }
      return path
    }
    function normalizeString (path, allowAboveRoot, separator, isPathSeparator) {
      let res = ''
      let lastSegmentLength = 0
      let lastSlash = -1
      let dots = 0
      let code
      for (let i = 0; i <= path.length; ++i) {
        if (i < path.length) { code = path.charCodeAt(i) } else if (isPathSeparator(code)) { break } else { code = CHAR_FORWARD_SLASH }
        if (isPathSeparator(code)) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (res.length < 2 || lastSegmentLength !== 2 ||
          res.charCodeAt(res.length - 1) !== CHAR_DOT ||
          res.charCodeAt(res.length - 2) !== CHAR_DOT) {
              if (res.length > 2) {
                const lastSlashIndex = res.lastIndexOf(separator)
                if (lastSlashIndex !== res.length - 1) {
                  if (lastSlashIndex === -1) {
                    res = ''
                    lastSegmentLength = 0
                  } else {
                    res = res.slice(0, lastSlashIndex)
                    lastSegmentLength = res.length - 1 - res.lastIndexOf(separator)
                  }
                  lastSlash = i
                  dots = 0
                  continue
                }
              } else if (res.length === 2 || res.length === 1) {
                res = ''
                lastSegmentLength = 0
                lastSlash = i
                dots = 0
                continue
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0) { res += separator + '..' } else { res = '..' }
              lastSegmentLength = 2
            }
          } else {
            if (res.length > 0) { res += separator + path.slice(lastSlash + 1, i) } else { res = path.slice(lastSlash + 1, i) }
            lastSegmentLength = i - lastSlash - 1
          }
          lastSlash = i
          dots = 0
        } else if (code === CHAR_DOT && dots !== -1) {
          ++dots
        } else {
          dots = -1
        }
      }
      return res
    }
    function join () {
      if (arguments.length === 0) { return '.' }
      const sep = arguments[0].indexOf('/') > -1 ? '/' : '\\\\'
      let joined
      let firstPart
      for (let i = 0; i < arguments.length; ++i) {
        const arg = arguments[i]
        if (arg.length > 0) {
          if (joined === undefined) { joined = firstPart = arg } else { joined += sep + arg }
        }
      }
      if (joined === undefined) { return '.' }
      let needsReplace = true
      let slashCount = 0
      if (isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount
        const firstLen = firstPart.length
        if (firstLen > 1) {
          if (isPathSeparator(firstPart.charCodeAt(1))) {
            ++slashCount
            if (firstLen > 2) {
              if (isPathSeparator(firstPart.charCodeAt(2))) { ++slashCount } else {
                // We matched a UNC path in the first part
                needsReplace = false
              }
            }
          }
        }
      }
      if (needsReplace) {
      // Find any more consecutive slashes we need to replace
        for (; slashCount < joined.length; ++slashCount) {
          if (!isPathSeparator(joined.charCodeAt(slashCount))) { break }
        }
        // Replace the slashes if needed
        if (slashCount >= 2) { joined = sep + joined.slice(slashCount) }
      }
      return normalize(joined)
    }

    // HMR 主逻辑
    seajs.use(['${isMagix5 ? 'magix5' : 'magix'}'], function (Magix) {
        const oldMountView = Magix.Vframe.prototype.${
          isMagix5 ? 'mount' : 'mountView'
        };
        Magix.Vframe.prototype.${
          isMagix5 ? 'mount' : 'mountView'
        } = function (${isMagix5 ? 'node, ' : ''}path, params) {
            this.viewInitParams = params;
            return oldMountView.apply(this, arguments);
        };
    });

    const ws = new WebSocket('ws://${host}:${wsPort}')
    ws.onopen = function () {
        console.log("[HMR] websocket 握手成功!");
    };
    ws.onclose = function (e) {
        console.log('[HMR] websocket 服务器关闭了!')
    }
    ws.onmessage = function (e) {
        const pathObjs = JSON.parse(e.data)

        // isReload 强制直接刷新
        if (pathObjs.isReload) {
            return window.location.reload()
        }

        if (pathObjs.type === 'error') {
            console.error(pathObjs.message)
            return 
        }

        console.log('[HMR] 本地修改的文件数据', pathObjs)
        
        //找到对应的view更新
        seajs.use(['${isMagix5 ? 'magix5' : 'magix'}'], function (Magix) {
            const allVframes = Magix.Vframe.all()
            const currentVframes = [] //有可能有多个相同的view
            
            // 清除 Magix 缓存的样式文件，支持多种格式
            const supportStyles = /(:?\.css|\.less|\.sass|\.scss)$/
            if (supportStyles.test(pathObjs.originPath)) {
                const styles = Magix.applyStyle;
                for (const s in styles) {
                    if (s == pathObjs.originPathResolve) {
                        delete styles[s];
                        document.getElementById(s).remove()
                        break;
                    }
                }
            }

            // seajs 移除 view 模块缓存
            pathObjs.depsPaths.forEach(function (_viewPath) {

                // 递归处理所有依赖的模块
                function recur(viewPath) {

                  let isMatch = false // 是否找到当前页面有存在对应模块的 view
                  // 检测是否存在当前加载的view
                  for (const key in allVframes) {
                    const vframe = allVframes[key]
                    if (!vframe.path) continue
                    const info = Magix.parseUrl(vframe.path);
    
                    if (info.path === viewPath) {
                        currentVframes.push(vframe)
                        isMatch = true
                    }
                  }

                  // 先删除当前模块的缓存 
                  const path = seajs.resolve(viewPath); // 模块的完整绝对路径
                  delete seajs.cache[path];
                  delete seajs.data.fetchedList[path];

                  // 如果匹配到当前模块有已加载的 view，则不做依赖查找
                  // 因为父 view 加载了子 view 会体现在父 view 模块的依赖里，会导致 子 view 的所有祖先 view 全部刷新，不符预期
                  if (!isMatch) {
                    // 从所有cache里找有依赖当前模块的模块，也删除模块缓存
                    for (key in seajs.cache) {
                      const cache = seajs.cache[key]
                      const cacheUri = cache.uri.replace(/\\/[^/]+$/, '') // 只保留目录
                      
                      // 遍历模块的依赖
                      for (const dep of cache.dependencies) {
                        if (dep) {
                          let depUri = join(cacheUri, dep) + '.js' // 模块的完整绝对路径
                          depUri = depUri.replace(/^http(s)?:\\//, 'http$1://') // 修复正确的 http 地址
                          
                          // 匹配到依赖，如果有 ?xxx=1 额外参数，得去除
                          if (depUri === path.replace(/\\?.*$/, '')) {
                            // 递归处理所有依赖模块
                            recur(cache.id)
                            break
                          }
                        }
                      }
                    }
                  }
                }

                // 启动
                recur(_viewPath)
                
            })

            // 如果当前页面存在对应的 view，则立即更新
            if (currentVframes.length) {
                // 重新加载view模块
                currentVframes.forEach(function (vf) {
                    const info = Magix.parseUrl(vf.path);
                    console.log('[HMR] 重载的模块：', info.path)
                    vf.${isMagix5 ? 'mount' : 'mountView'}(${
    isMagix5 ? 'vf.root, ' : ''
  }vf.path, vf.viewInitParams)
                })
            }

        }, function (err) {
            console.log('[HMR] 加载magix模块失败，重新刷新页面')
            window.location.reload()
        })
    }
})()
`
}

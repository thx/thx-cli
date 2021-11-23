// 多个pid默认取第一个
export function parseParams(str) {
  var p = {};
  if (str) {
    for (var i = 0, s, d = str.split(/&+/), len = d.length; i < len; i++) {
      s = d[i];
      if (s) {
        var k, v;
        try {
          k = decodeURIComponent(s.replace(/=.*/, ""))
          v = decodeURIComponent(s.replace(/(.*?=)|(.*)/, ""))
        } catch (e) {
          k = "";
          v = "";
        }
        if (k || v) {
          if (k in p) {
            if (typeof p[k] === "string") p[k] = [p[k]];
            p[k].push(v);
          } else {
            p[k] = v;
          }
        }
      }
    }
  }
  return p;
}

export function joinParams(obj) {
  var res = [],
    s = function(k, v) {
      k = encodeURIComponent(k);
      v = encodeURIComponent(v);
      if (k || v) {
        res.push(k + (v === undefined ? "" : "=" + v));
      }
    };
  for (var k in obj) {
    var v = obj[k];
    if (v && v.constructor === Array) {
      for (var i = 0, len = v.length; i < len; i++) {
        s(k, v[i]);
      }
    } else {
      s(k, v);
    }
  }
  return res.join("&");
}

export function joinParamsToUrl(obj) {
  var res = [],
    s = function(k, v) {
      k = encodeURIComponent(k);
      v = encodeURIComponent(v);
      if (k || v) {
        res.push(k + (v === undefined ? "" : "=" + v));
      }
    };
  for (var k in obj) {
    var v = obj[k];
    if (v && v.constructor === Array) {
      s(k, v.join(','))
    } else {
      s(k, v);
    }
  }
  return res.join("&");
}

// /*
// * 添加query string
// * @param {Object} opt
// * @param {Object} opt.data
// * @param {String} opt.url 默认为location.href
// * @param {Boolean} opt.ignoreEmpty 如果待添加的值为空是否忽略，默认为true
// * @example
// * Util.addQueryStr({
// *     data: {
// *         a: 1,
// *         b: 2
// *     },
// *     ignoreEmpty: true
// * })
// */
// Util.addQueryStr = function(opt) {
//   opt = opt || {};
//   var data = opt.data || {},
//     url = opt.url || location.href,
//     ignoreEmpty = typeof opt.ignoreEmpty == "boolean" ? opt.ignoreEmpty : true,
//     hasSearch = url.match(/\?/);
//   for (var key in data) {
//     var val = data[key],
//       str = "",
//       match = null,
//       reg = new RegExp("[?&#]((" + key + "=)[^&#]*)[&#]?", "i");
//     //ignoreEmpty为true时， 若val为空则跳过
//     if (ignoreEmpty && !val) {
//       continue;
//     }
//     str = key + "=" + val;
//     match = url.match(reg);
//     if (match) {
//       url = url.replace(match[1], str);
//     } else {
//       if (hasSearch) {
//         url += "&" + str;
//       } else {
//         url += "?" + str;
//         hasSearch = true;
//       }
//     }
//   }
//   return url;
// };
// /*
// * @param {Object} opt
// * @param {Array} opt.data 待删除的query参数
// * @param {String} opt.url 默认为location.href
// * @example
// * Util.deleteQueryStr({
// *     url: 'https://mo.m.etao.com/test?id=111&spm=1002.10.11.1&a=222&c=12',
// *     data: ['spm', 'a']
// * })
// * => https://mo.m.etao.com/test?id=111&c=12
// */
// Util.deleteQueryStr = function(opt) {
//   opt = opt || {};
//   var data = opt.data || [],
//     url = opt.url || location.href;
//   data.forEach(function(key, index) {
//     if (!key) {
//       return;
//     }
//     var match = null,
//       reg = new RegExp("[?&#](" + key + "=[^&#]*[&]?)", "i");
//     match = url.match(reg);
//     if (match) {
//       url = url.replace(match[1], "");
//     }
//   });
//   return url;
// };
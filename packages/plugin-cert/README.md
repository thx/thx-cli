## 插件说明

`rmx cert --install`
一键生成自签名证书并添加到macOS钥匙串，在这个过程中，需要输入本地启动https服务要支持的域名，多个以,分隔，然后会提示要输入密码，用来将自签名证书以sudo权限添加到系统钥匙串里，如果添加失败，后面浏览器访问https服务，会提示不安全。

`rmx cert --trust`
如果install过程中三次输入密码都错误了，还可以单独运行这个命令重新添加到系统钥匙串。或者发现chrome下访问https还是提醒非安全，可以去查看确认下证书是否已经添加到系统钥匙串，证书是否过期。

`rmx cert --info`
生成证书后，可以随时通过这个命令查看密钥等文件的位置，方便你在配置服务器https时需要它，还可以看到支持的域名，是否已经添加到系统钥匙串，证书的有效时间。

`rmx cert --add <host>`
通过这个命令新增本地https服务要用的域名，新增时先检测证书是否已经支持了该域名，比如证书支持*.m.taobao.com，本地要使用test.m.taobao.com域名，检测发现已经支持了，会提醒不用新增。如果遇到需要新增的，会先删除原有的密钥等文件和钥匙串里证书，然后再新增。

`rmx cert unInstall`
删除本地存放密钥、证书等文件的目录，删除钥匙串里添加的证书
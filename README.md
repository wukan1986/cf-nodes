# cf-nodes-aggregator
将多个cf的节点的`uuid`和`sni`聚合到一个订阅中

每个账号`10w请求`限制，注册多个CF账号后，除非统一`UUID`，否则无法利用`edgetunnel`的单面板管理多节点

所以，我提供了一个工具，用来归集各组`UUID`和`SNI`，实现一个订阅，平均调用所有的节点

## 原理
目前大家部署的`edgetunnel`和`cfnew`等`CF`项目，只要提供可用的`vless/trojan/ss`链接，将此链接中的`hostname`、`port`修改成优选的IP或域名，就可以生成无数新链接

## 如何获取vless链接
1. `edgetunnel`的后台面板直接提供了原始`vless/trojan/ss`链接
2. `edgetunnel`的订阅连接直接用浏览器打开获取`vless/trojan/ss`链接
3. `v2rayN`中选中一个`vless/trojan/ss`节点，右键导出，导出分享链接到剪贴板
4. 如果只有`clash`配置，在`v2rayN`中对照设置，**测试真连延迟**后，再导出`vless/trojan/ss`链接。以下是对照表

| vless/trojan | clash | v2rayN | 示例 |
|---|---|---|---|
| hostname | server | 地址(address) | www.temu.com 或 127.0.0.1 |
| port | port | 端口(port) | 443 |
| username | uuid | 用户ID(id) | 0c16c03b-737f-4988-82b3-526a3efb43ba |
| path= | path | 路径(path) | /proxyip=proxyip.cmliussss.net?ed=2095 |
| security=tls | tls:true | 传输层安全(TLS):tls | |
| security=none | tls:false | 传输层安全(TLS): | |
| sni=| servername | SNI | xxx.xxxx.de5.net | 
| host=| Host | 伪装域名(host) | 转成clash时host丢弃用的sni的值 |
| ech= | ech-opts: {enable: true, query-server-name: cloudflare-ech.com} | EchCofigList | cloudflare-ech.com+https://223.5.5.5/dns-query |

## 部署方法
本工具由3部分组成，`订阅器`、`订阅转换后端`、`短链接`，可以单独使用，也可搭配使用

`短链接`必须：
1. `绑定`->`KV命名空间`->变量名`KV`
2. `设置`->`运行时`->`兼容性标志`->`global_fetch_strictly_public`
3. `设置`->`变量和机密`->文本 变量名`API_KEY`->任意密码

`订阅器`、`订阅转换后端`无要求。
1. `Workers`部署复制代码即可。修改调试方便，国内无法直接访问，需配合自定义域
2. `Pages`部署上传代码即可。无域名可选这种，提供了免费域名

## 使用方法
1. 访问`https://*.pages.dev/home`，进入订阅页面。提前准备好可用的节点文件，然后依次设置，观察链接是否可用
2. 访问`https://*.pages.dev/link`，进入短链接管理。提供了基础的短链接功能
2. 访问`https://*.pages.dev/sub`，与公开的订阅转换服务参数相同，但只识别`url`、`scv`参数

## 额外功能（抓取优选信息）
1. 例如：访问`https://*.pages.dev/extract?hostnames=https://raw.githubusercontent.com/hc990275/yx/main/cfyxip.txt&region=HK-JP-US&limit=10-6-10`，抓取IP信息
2. 例如：访问`https://*.pages.dev/extract?hostnames=https://raw.githubusercontent.com/wukan1986/cf-nodes-aggregator/main/best_domains.txt&limit=20`，抓取域名信息

## 额外功能（指定UA爬取）
1. 订阅时指定`UA`，临时解决部分软件不支持自定义`UA`的场景，也能解决部分订阅地址无法直接访问的场景
2. 为`url=`参数添加`_ua=clash`参数。注意：是为参数添加参数，而不是为链接添加参数。例如
```markdown
http://127.0.0.1:8787/fetch?url=http://httpbin.org/get?_ua=clash    # 为url参数添加参数。正确
http://127.0.0.1:8787/fetch?url=http://httpbin.org/get&_ua=clash    # 为URL链接添加参数。错误
```
3. 为何这么设计？多机场聚合时，需要为每个链接单独设置`UA`。这也导致正确添加`_ua`非常麻烦
```javascript
const url1 = new URL('http://httpbin.org/get?token=XXXXXX');
const url2 = new URL('https://*.pages.dev/fetch');
url1.searchParams.set('_ua', 'clash');

console.log(url1.href);
// 在链接管理，和订阅设置界面一般使用此条
// http://httpbin.org/get?token=XXXXXX&_ua=clash

url2.searchParams.set('url', url1.href);
console.log(url2.href);
// 在浏览器、clash客户端需使用这一条
// https://*.pages.dev/fetch?url=http%3A%2F%2Fhttpbin.org%2Fget%3Ftoken%3DXXXXXX%26_ua%3Dclash

```
以上代码按需修改后，在浏览器中按`F12`,在控制台输入代码，即可看到转换后的链接。

4. 目前本项目中所有`fetch`网络请求都支持添加`_ua`参数
```markdown
1. /fetch?url=
2. /extract?hostnames=
3. /v2ray?hostnames=&nodes=
4. /base64?hostnames=&nodes=
6. /sub?url=
7. 链接管理器。类型为`拼接`。例如可以实现多个优选列表合并成一个

```

5. 链接管理器的`拼接`模式内含`fetch`功能(支持`_ua`参数)，同时还含`短链`功能，比`/fetch`更简单直接，强烈推荐使用

## 我的推荐设置
两份节点列表，一份是好友搭建的VPS节点，一份是收集的网友分享的CF节点。一般配置三个订阅

1. VPS节点
	- 不支持优选，所以设置时`hostnames`留空，`region`留空，`foramt=clash`，这样可以多个节点混合使用
2. CF节点，优选域名(推荐。节点连通率高，可长期不用更新订阅)
	- `hostnames`选择第一项`优选域名`，`limit=20`，`foramt=clash`。基本有90%以上的节点可用
3. CF节点，优选IP(优势是可选地区，节点延时小，但稳定性差，需要不定期重新订阅)
	- `hostnames`选择第二项`优选IP(地区分组)`，`region=HK-JP-US&limit=10-6-10`,`foramt=clash`

一般常用优选域名；特殊需求用优选IP的地区分组；VPS节点用于代替CF节点不适用的情况，如`git clone`

## 其他问题
1. `workers.dev`地址无法访问怎么办？
	1. 部署成`Pages`, `*.pages.dev`一般是可以直接访问的
	2. 添加自定义域，用新域名访问也可以
2. 如何知道某个`uuid`和`sni`失效了？
	1. 按名称排序，观察某个`uuid`是否全为`-1`或`Timeout`，别名`remark`前是`uuid`的前4位，可用于区分
	2. 某软件代理6个一行，可以`NODES`数量不足时复制多份补全6条，这样一列就是同一`uuid`的，整列都超时就可以剔除了
3. `workers`和`pages`有什么区别？
	1. 自己没域名，选`pages`，但每次修改变量要重新上传代码
	2. `workers`修改调试方便，国内可搭配自定义域访问

## 二次开发
```commandline
# 开一终端
npm run dev
# 访问 http://127.0.0.1:8787

# 再开一终端
npm install -g http-server
http-server
# 访问 http://127.0.0.1:8080

```

### 订阅转换二次开发
1. 将一条订阅链接，复制到第三方服务中，生成`clash.yaml`文件,保存下来
2. 将一条订阅链接，复制到`http://127.0.0.1:8080/link`中，复制随机生成的链接`A`
3. 访问`http://127.0.0.1:8787/home`，将`A`粘贴到`nodes`字段中
4. 将输出格式改成`clash`，输出框会有新链接`B`，用浏览器访问`B`，观察`yaml`文件
5. 比较两次的`yaml`文件，找出不同的地方，在`_worker.js`中添加对应的逻辑，导入到软件中验证是否可用

## ECH
发现目前网络上提供的`v2ray`转`clash/singbox`的服务都会丢失`ech`信息，本工具会试着补全`ECH`信息，
底层会将`ech=1`标记在`path`字段，经过转换后，此字段还保留，可以被再次利用起来。

`edgetunnel`和`cfnew`有对`DNS`覆写的功能，但改`yaml`实在麻烦，还是交给各客户端软件的覆写吧

### 浏览器ECH设置教程
https://zhuanlan.zhihu.com/p/3739662610

### 检查浏览器ECH是否开启(需使用TUN模式)
https://www.cloudflare-cn.com/ssl/encrypted-sni/#results


## 如何自建CF节点/ProxyIP节点
参考`自建节点指南.md`

## 参考学习
1. [cmliu/edgetunnel](https://github.com/cmliu/edgetunnel)
2. [byJoey/cfnew](https://github.com/byJoey/cfnew)
3. [yonggekkk/Cloudflare-vless-trojan](https://github.com/yonggekkk/Cloudflare-vless-trojan)
4. [hc990275/sub](https://github.com/hc990275/sub)
5. [alienwaregf/Cloudflare-Country-Specific-IP-Filter](https://github.com/alienwaregf/Cloudflare-Country-Specific-IP-Filter)
6. [DaBoWin/cfssclash](https://github.com/DaBoWin/cfssclash)
7. [Cloudflare EDT 导航](https://bestcf.pages.dev/)


感谢各位大佬提供的代码和服务

## 免责声明
1. 本项目仅供教育、科学研究及个人安全测试之目的。
2. 使用者在下载或使用本项目代码时，必须严格遵守所在地区的法律法规。
3. 作者对任何滥用本项目代码导致的行为或后果均不承担任何责任。
4. 本项目不对因使用代码引起的任何直接或间接损害负责。
5. 建议在测试完成后 24 小时内删除本项目相关部署
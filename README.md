# performance


### 浏览器兼容性

请参考：[http://caniuse.com/#feat=nav-timing](http://caniuse.com/#feat=nav-timing)


### 优势

* 浏览器原生支持，准确性高
* 能够获取到更多的数据，例如DNS解析时间、重定向时间、白屏时间、首屏时间等
* 支持页面首次渲染时间的采集
* 可定制化程度高
* 支持在网页加载完成后进行数据采集和发送，减少页面的性能损耗

### 使用示例（支持 commonjs 、umd、ES模块引入）

Using npm:

```bash
$ npm install @@rouchi/performance --save
```
main.js入口文件引入:
```js
import JYperformance from '@rouchi/performance'

if (process.env.NODE_ENV === 'production') { // development环境下不建议频繁上报
    new JYperformance({
        application: 'crm_performance.pc', // 项目
        platform: 'web', // 平台
        env: 'xxx' // 环境
    }).start()
}
```
Using cdn:

```html
<script src="https://common-static-cdn.jingyupeiyou.com/vendor/performance/performance-1.0.20.umd.js"></script>
```
main.js入口文件引入:
```js
if (process.env.NODE_ENV === 'production' && window.JYperformance) { // development环境下不建议频繁上报
    new window.JYperformance({
        application: 'crm_performance.pc', // 项目
        platform: 'web', // 平台
        env: 'xxx' // 环境
    }).start()
}
```


### 采集的数据说明

默认情况下脚本将会采集以下数据（详细计算公式可参看采集脚本）：

|参数            |类型            |描述   |
|:-------------:|:-------------:|:-----:|
|`t_dns`|number|DNS解析时间|
|`t_tcp`|number|服务器连接时间|
|`t_request`|number|服务器响应时间|
|`t_response`|number|网页文档下载时间|
|`t_firstPaint`|number|首屏渲染时间|
|`t_domready`|number|DOM Ready时间（总和）|
|`t_onload`|number|onload时间（总和）|
|`t_white`|number|白屏时间|
|`t_all`|number|全部过程时间|
|`userAgent`|string|浏览器用户代理信息|
|`appName`|string|浏览器名称|
|`appVersion`|string|浏览器版本号|
|`platform`|string|浏览器操作系统或者硬件平台|
|`href`|string|当前页面url|
|`hostname`|string|当前页面域名|
|`pathname`|string|当前页面路劲|
|`search`|string|当前页面携带参数|

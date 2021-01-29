
class Performance {
  constructor(option = {}) {
    this.timing = {}
    this.option = option
    this.env = option.env
    this.basicOption = {
      action: 'error',
      category: 'common',
      log_level: 'INFO', // 级别
      timestamp: Date.now(),
      upload_timestamp: Date.now(),
      device_id: '',
      application: option.application,
      platform: option.platform || 'web' // 平台
    }
  }

  // 是否支持performance
  check() {
    return window.performance && window.performance.timing
  }
  async getNavigatorInfo(timing) {
    const { userAgent = '', appName = '', platform = '', appVersion = '' } = window.navigator
    const { memory = {} } = window.performance
    if (Object.keys(memory).length) {
      Object.assign(this.timing, memory)
    }
    Object.assign(this.timing, { appName, platform, userAgent, appVersion })
    const { href, hostname, pathname, search } = window.location
    Object.assign(this.timing, {  href, hostname, pathname, search })
  }

  // 入口
  start() {
    if (this.check()) {
      this.getNavigatorInfo()
      if (window.performance.timing.loadEventEnd > 0) {
        this.setup()
      } else {
        window.onload = () => {
          window.setTimeout(() => {
            this.setup()
          }, 0)
        }
      }
    } else {
      try {
        throw new Error('浏览器不支持performance')
      } catch(err) {
        console.log(err)
      }
    }
  }

  // 需要发送给后端的数据
  setData (timing) {
    const startTime = timing.navigationStart || timing.fetchStart // 开始解析时间
    const options = {
        't_dns': timing.domainLookupEnd - timing.domainLookupStart, // DNS查询时间
        't_tcp': timing.connectEnd - timing.connectStart, // 服务器连接时间
        't_request': timing.responseStart - timing.requestStart, // 服务器响应时间
        't_white': timing.responseStart - startTime, // 白屏时间
        't_response': timing.responseEnd - timing.responseStart, // 网页下载时间
        't_firstPaint': timing.domInteractive - startTime, // 首屏渲染时间
        't_domReady': timing.domContentLoadedEventEnd - startTime, // HTML 加载完成时间， 即 DOM Ready 时间
        't_onload': timing.loadEventStart - startTime, // onload时间（总和）
        't_all': timing.loadEventEnd - startTime // 页面完全加载时间
    }
    Object.assign(this.timing, options)
    const unusualData = Object.values(options).filter(val => val < 0) // 过滤异常数据
    return unusualData.length === 0
  }

  // 程序的处理（包括数据收集、发送动作）
  setup () {
    const timing = window.performance.timing
    // 数据正常时才发送
    if (this.setData(timing)) {
      this.send()
    }
  }

  //发送数据到后端
  async send () {
    const url = this.option.url
    const params = {
      ...this.option.params,
      [this.option.content || 'content']: { ...this.timing, environment: this.option.env }
    }
    await ajax(url, 'POST', JSON.stringify(params))
  }
}

function ajax(url, method, params = {}){
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : ActiveXObject("microsoft.XMLHttp")
  xhr.open(method, url, true)
  xhr.setRequestHeader('contentType', 'application/json; charset=utf-8')
  xhr.send(params)
  xhr.onreadysattechange = () =>{
      if(xhr.readystate == 4){
          if(xhr.status == 200){
              var data = xhr.responseTEXT
              return data
          }
      }
  }    
}

export default Performance
'use strict';

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.hooks = {
      'package:initialize': this.appendEventsToTargetFunction.bind(this),
    };
  }

  appendEventsToTargetFunction() {
    if (this.targetDefined() && this.targetExists()) {
      const fnLogEvents = this.fnNames().map(function(name) {
        return { cloudwatchLog: '/aws/lambda/'+name }
      })
      const existingEvents = this.targetFn().events
      this.targetFn().events = [].concat.apply(existingEvents, fnLogEvents)
    }
  }

  targetDefined() {
    const custom = this.serverless.service.custom
    if (custom === undefined) { return false }
    const config = custom.logfunnel
    if (config === undefined) { return false }
    const target = config.target
    if (target === undefined || target === '') { return false }
    return true
  }

  targetExists() {
    return this.targetFn() !== undefined
  }

  targetFn() {
    const custom = this.serverless.service.custom
    if (custom === undefined) { return }
    const config = custom.logfunnel
    if (config === undefined) { return }
    const target = config.target
    if (target === undefined || target === '') { return }
    return this.serverless.service.functions[target]
  }

  fnNames() {
    const fns = this.serverless.service.functions
    const target = this.targetFn()
    const sources = []
    Object.keys(fns).map(k => fns[k]).forEach((fn) => {
      if(fn.name != target.name) {
        sources.push(fn)
      }
    })
    return sources.map(s => s.name)
  }
}

module.exports = ServerlessPlugin;

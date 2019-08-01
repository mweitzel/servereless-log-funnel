'use strict';

const { dig } = require('./helper')

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.hooks = {
      'package:initialize': this.appendEventsToTargetFunction.bind(this),
    };
  }

  appendEventsToTargetFunction() {
    if (this.targetConfigDefined() && this.targetExists()) {
      const fnLogEvents = this.fnNames().map(function(name) {
        return { cloudwatchLog: '/aws/lambda/'+name }
      })
      const existingEvents = this.targetFn().events
      this.targetFn().events = [].concat.apply(existingEvents, fnLogEvents)
    }
  }

  targetConfig() {
    return dig(this, 'serverless.service.custom.logfunnel.target')
  }
  targetConfigDefined() {
    return !!this.targetConfig()
  }

  targetExists() {
    return !!this.targetFn()
  }

  targetFn() {
    return this.serverless.service.functions[this.targetConfig()]
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

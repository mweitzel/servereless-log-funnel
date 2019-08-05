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
      const defaultFilter = this.filterConfig()
      const newEvents = this.nonTargetFns().map(function(fn) {
        const sourceLogGeroup = '/aws/lambda/'+fn.name
        const filter = getFilter.call(fn) || defaultFilter
        if (filter) {
          return { cloudwatchLog: { logGroup: sourceLogGeroup, filter: filter } }
        } else {
          return { cloudwatchLog: sourceLogGeroup }
        }
      })
      const existingEvents = this.targetFn().events
      this.targetFn().events = [].concat.apply(existingEvents, newEvents)
    }
  }

  targetConfig() {
    return dig(this, 'serverless.service.custom.logfunnel.target')
  }
  filterConfig() {
    return dig(this, 'serverless.service.custom.logfunnel.filter')
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

  nonTargetFns() {
    const fns = this.serverless.service.functions
    const target = this.targetFn()
    return Object.values(fns).filter((fn) => fn.name != target.name)
  }
}

function getFilter() {
  return dig(this, 'logfunnel.filter')
}

module.exports = ServerlessPlugin;

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
      const defaultEnabled = this.enabledConfig()
      const defaultFilter = this.filterConfig()
      const newEvents = this.nonTargetFns().filter((fn) => {
        // with config defaulting to on, fn must explicitly specify off
        // with config defaulting to off, fn must explicitly specify on
        if (defaultEnabled) {
          return true && !(dig(fn, 'logfunnel.enabled') === false)
        } else {
          return false || (dig(fn, 'logfunnel.enabled') === true)
        }
        return defaultEnabled
      }).map(function(fn) {
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
  enabledConfig() {
    const enabledFlag = dig(this, 'serverless.service.custom.logfunnel.enabled')
    return enabledFlag === true || enabledFlag === undefined
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

const plugin = require('./index')
const { $, equal, test } = require('./test-helper')
const { dig } = require('./helper')


module.exports = {
  testConfigNoFilter: function() {
    const actualSls = slsConfig()
    actualSls.service.custom.logfunnel = { target: 'myFunnel' }

    const expectedSls = deepCopy(actualSls)
    expectedSls.service.functions.myFunnel.events = [
      { cloudwatchLog: '/aws/lambda/projectname-stage-foofn' },
      { cloudwatchLog: '/aws/lambda/projectname-stage-barfn' },
    ]

    const eventAdder = new plugin(actualSls)

    eventAdder.appendEventsToTargetFunction()
    $(actualSls).should(equal(expectedSls))
  },
  testConfigWithDefaultFilter: function() {
    const actualSls = slsConfig()
    actualSls.service.custom.logfunnel = { target: 'myFunnel', filter: '{ $.level = potato }' }

    const expectedSls = deepCopy(actualSls)
    expectedSls.service.functions.myFunnel.events = [
      { cloudwatchLog:
        { logGroup: '/aws/lambda/projectname-stage-foofn',
          filter: '{ $.level = potato }' } },
      { cloudwatchLog:
        { logGroup: '/aws/lambda/projectname-stage-barfn',
          filter: '{ $.level = potato }' } },
    ]

    const eventAdder = new plugin(actualSls)

    eventAdder.appendEventsToTargetFunction()
    $(actualSls).should(equal(expectedSls))
  },
  testConfigFnFilterOverride: function() {
    const actualSls = slsConfig()
    actualSls.service.custom.logfunnel = { target: 'myFunnel' }
    actualSls.service.functions.barfn.logfunnel = { filter: '{ $.something = stuff }' }

    const expectedSls = deepCopy(actualSls)
    expectedSls.service.functions.myFunnel.events = [
      { cloudwatchLog: '/aws/lambda/projectname-stage-foofn' },
      { cloudwatchLog:
        { logGroup: '/aws/lambda/projectname-stage-barfn',
          filter: '{ $.something = stuff }' } },
    ]

    const eventAdder = new plugin(actualSls)

    eventAdder.appendEventsToTargetFunction()
    $(actualSls).should(equal(expectedSls))
  },
  testConfigBothDefaultAndCustomFilter: function() {
    const actualSls = slsConfig()
    actualSls.service.custom.logfunnel = { target: 'myFunnel', filter: '{ $.level = potato }' }
    actualSls.service.functions.barfn.logfunnel = { filter: '{ $.something = stuff }' }

    const expectedSls = deepCopy(actualSls)
    expectedSls.service.functions.myFunnel.events = [
      { cloudwatchLog:
        { logGroup: '/aws/lambda/projectname-stage-foofn',
          filter: '{ $.level = potato }' } },
      { cloudwatchLog:
        { logGroup: '/aws/lambda/projectname-stage-barfn',
          filter: '{ $.something = stuff }' } },
    ]

    const eventAdder = new plugin(actualSls)

    eventAdder.appendEventsToTargetFunction()
    $(actualSls).should(equal(expectedSls))
  },
  testDig: function() {
    const foo = { bar: { baz: { bing: 5 } } }
    $(dig(foo, 'bar.baz.bing')).should(equal(5))
    $(dig({}, 'bar.baz.bing')).should(equal(undefined))
  },
  testDeepCopy: function() {
    const foo1 = { foo: 'foo', bar: { baz: 'baz' }, boot: [0, 1, "two", { three: 'three' }] }
    const foo2 = { foo: 'foo', bar: { baz: 'baz' }, boot: [0, 1, "two", { three: 'three' }] }
    $(deepCopy(foo1)).should(equal(foo2))
  }
}

function slsConfig() {
  return {
    service: {
      functions: {
        foofn: {
          handler: 'fooHandler',
          events: [],
          name: 'projectname-stage-foofn',
        },
        barfn: {
          handler: 'barHandler',
          events: [],
          name: 'projectname-stage-barfn',
        },
        myFunnel: {
          handler: 'myFunnelHandler',
          events: [],
          name: 'projectname-stage-myFunnel',
        },
      },
      custom: {},
    }
  }
}

test(module)

function deepCopy(obj) {
  if(typeof obj !== 'object'){
    return obj
  }
  var newObj
  if(Array.isArray(obj)) {
    newObj = []
  } else {
    newObj = {}
  }
  Object.keys(obj).forEach((k) => {
    newObj[k] = deepCopy(obj[k])
  })
  return newObj
}

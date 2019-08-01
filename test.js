const plugin = require('./index')
const ts = require('./test-helper')
const { dig } = require('./helper')
const $ = ts.$
const equal = ts.equal

test()
function test() {
  const actualSls = slsConfig()
  const expectedSls = slsConfig()
  expectedSls.service.functions.myFunnel.events = [
    { cloudwatchLog: '/aws/lambda/projectname-stage-foofn' },
    { cloudwatchLog: '/aws/lambda/projectname-stage-barfn' },
  ]

  const eventAdder = new plugin(actualSls)

  eventAdder.appendEventsToTargetFunction()
  $(actualSls).should(equal(expectedSls))
}

testDig()
function testDig() {
  const foo = { bar: { baz: { bing: 5 } } }
  $(dig(foo, 'bar.baz.bing')).should(equal(5))
  $(dig({}, 'bar.baz.bing')).should(equal(undefined))
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
      custom: {
        logfunnel: {
          target: 'myFunnel',
        }
      }
    }
  }
}


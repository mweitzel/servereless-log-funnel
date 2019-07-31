const plugin = require('./index')
const ts = require('./test-helper')
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


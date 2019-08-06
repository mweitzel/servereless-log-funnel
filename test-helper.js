const ts = module.exports = {
  assert: function(t, msg) {
    if (t) { return }
    throw new Error(msg)
  },

  "$": function(given){
    return {
      subject: given,
      should: function(matcher) {
        return ts.assert.apply(null, matcher(given))
      }
    }
  },

  equal: function(obj) {
    return (subject) => {
      const equals = JSON.stringify(obj) === JSON.stringify(subject)
      return [
        equals,
        equals ? '' : [subject, obj].map((a) => JSON.stringify(a, null, 2)).join("\ndoes not equal\n"),
      ]
    }
  },

  test: function(module) {
    const tests = Object.keys(module.exports).filter(fnName => fnName.startsWith('test'))
    const failures = []
    const dots = []
    tests.forEach((t) => {
      try {
        module.exports[t]()
        dots.push('.')
      } catch (e) {
        var msg
        if (typeof err === 'error') {
          msg = e
        } else {
          msg = e
        }
        dots.push('x')
        failures.push({
          test: t,
          msg: msg,
        })
      }
      process.stderr.write(dots.join('')+'\r')
      if(failures.length) {
        process.nextTick(function(){
          console.log('\n\nfailures:\n')
          failures.forEach((f) => {
            console.log('test', '"'+f.test+'"', 'failed with:\n', f.msg, '\n')
          })
          process.exit(1)
        })
      }
    })
  }
}

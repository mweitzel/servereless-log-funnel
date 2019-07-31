const ts = module.exports = {
  assert: function(t, msg) {
    if (t) { return }
    throw msg
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
  }
}

var stats = require("stats-lite")
var factory = require("./factory")

module.exports.sum = factory(stats.sum)
module.exports.mean = factory(stats.mean)
module.exports.mode = factory(stats.mode)
module.exports.median = factory(stats.median)
module.exports.variance = factory(stats.variance)
module.exports.stdev = factory(stats.stdev)
module.exports.percentile = factory(stats.percentile)

module.exports.min = factory(function (vals) { return Math.min.apply(null, vals) })
module.exports.max = factory(function (vals) { return Math.max.apply(null, vals) })
module.exports.count = factory(function (vals) { return vals.length })
module.exports.first = factory(function (vals) { return vals[0] })
module.exports.last = factory(function (vals) { return vals[vals.length - 1] })
module.exports.sample = factory(function (vals) {
  return vals[(Math.random() * vals.length) | 0]
})
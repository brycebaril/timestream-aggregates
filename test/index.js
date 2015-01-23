var test = require("tape").test

var concat = require("concat-stream")
var gen = require("timestream-gen").gen
var spigot = require("stream-spigot")

var agg = require("../aggregates")
var floordate = require("floordate")

test("init", function (t) {
  t.equals(typeof agg.sum, "function", "sum is a function")
  t.equals(typeof agg.mean, "function", "mean is a function")
  t.equals(typeof agg.median, "function", "median is a function")
  t.equals(typeof agg.mode, "function", "mode is a function")
  t.equals(typeof agg.variance, "function", "variance is a function")
  t.equals(typeof agg.stdev, "function", "stdev is a function")
  t.equals(typeof agg.percentile, "function", "percentile is a function")
  t.equals(typeof agg.min, "function", "min is a function")
  t.equals(typeof agg.max, "function", "max is a function")
  t.equals(typeof agg.first, "function", "first is a function")
  t.equals(typeof agg.last, "function", "last is a function")
  t.equals(typeof agg.count, "function", "count is a function")
  t.equals(typeof agg.sample, "function", "sample is a function")
  t.end()
})

test("sum entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 55}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.sum("_t")).pipe(concat(check))
})

test("sum entire series (with timestamp)", function (t) {
  t.plan(1)

  var now = 1378510797174
  var series = gen({start: now, until: now + 1000, interval: 100})

  var expectedEnd = floordate(now, "day").getTime()

  function check(results) {
    var expected = [{_t: expectedEnd, gen: 55}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.sum("_t", "day")).pipe(concat(check))
})

test("sum multi column", function (t) {
  t.plan(1)

  var series = spigot({objectMode: true}, [
    { val: 0, foo: 99, v: 0 },
    { val: 0, foo: 99, v: 100 },
    { val: 2, foo: 99, v: 200 },
    { val: 2, foo: 99, v: 300 },
    { val: 2, foo: 99, v: 400 },
    { val: 5, foo: 99, v: 500 },
    { val: 5, foo: "cat", v: 600 },
    { val: 7, foo: null, v: 700 },
    { val: 8, foo: 99, v: 800 },
    { val: 9, v: 900 },
    { val: 10, v: 1000 }
  ])
  function check(results) {
    var expected = [{v: 0, val: 50, foo: 693}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.sum("v")).pipe(concat(check))
})

test("partial sum", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 10},
      {_t: 500, gen: 35},
      {_t: 1000, gen: 10}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.sum("_t", 500)).pipe(concat(check))
})

test("mean entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 5}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.mean("_t")).pipe(concat(check))
})

test("partial mean", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 2},
      {_t: 500, gen: 7},
      {_t: 1000, gen: 10}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.mean("_t", 500)).pipe(concat(check))
})

test("mode entire series", function (t) {
  t.plan(1)

  var series = spigot({objectMode: true}, [
    { val: 0, v: 0 },
    { val: 0, v: 100 },
    { val: 2, v: 200 },
    { val: 2, v: 300 },
    { val: 2, v: 400 },
    { val: 5, v: 500 },
    { val: 5, v: 600 },
    { val: 7, v: 700 },
    { val: 8, v: 800 },
    { val: 9, v: 900 },
    { val: 10, v: 1000 }
  ])

  function check(results) {
    var expected = [
      {v: 0, val: 2},
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.mode("v")).pipe(concat(check))
})

test("partial mode", function (t) {
  t.plan(1)

  var series = spigot({objectMode: true}, [
    { val: 0, v: 0 },
    { val: 0, v: 100 },
    { val: 2, v: 200 },
    { val: 2, v: 300 },
    { val: 2, v: 400 },
    { val: 5, v: 500 },
    { val: 5, v: 600 },
    { val: 7, v: 700 },
    { val: 8, v: 800 },
    { val: 9, v: 900 },
    { val: 10, v: 1000 }
  ])

  function check(results) {
    var expected = [
      {v: 0, val: 2},
      {v: 500, val: 5},
      {v: 1000, val: 10}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.mode("v", 500)).pipe(concat(check))
})

test("median entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 5}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.median("_t")).pipe(concat(check))
})

test("partial median", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 2},
      {_t: 500, gen: 7},
      {_t: 1000, gen: 10}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.median("_t", 500)).pipe(concat(check))
})

test("variance entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 10}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.variance("_t")).pipe(concat(check))
})

test("partial variance", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 2},
      {_t: 500, gen: 2},
      {_t: 1000, gen: 0}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.variance("_t", 500)).pipe(concat(check))
})

test("stdev entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: Math.sqrt(10)}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.stdev("_t")).pipe(concat(check))
})

test("partial stdev", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: Math.sqrt(2)},
      {_t: 500, gen: Math.sqrt(2)},
      {_t: 1000, gen: 0}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.stdev("_t", 500)).pipe(concat(check))
})

test("percentile entire series", function (t) {
  t.plan(1)

  var series = spigot({objectMode: true}, [
    { val: 0, v: 0 },
    { val: 0, v: 100 },
    { val: 2, v: 200 },
    { val: 2, v: 300 },
    { val: 2, v: 400 },
    { val: 5, v: 500 },
    { val: 5, v: 600 },
    { val: 7, v: 700 },
    { val: 8, v: 800 },
    { val: 9, v: 900 },
    { val: 10, v: 1000 }
  ])

  function check(results) {
    var expected = [
      {v: 0, val: 2},
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.percentile("v", 0.3)).pipe(concat(check))
})

test("partial percentile", function (t) {
  t.plan(1)

  var series = spigot({objectMode: true}, [
    { val: 0, v: 0 },
    { val: 0, v: 100 },
    { val: 2, v: 200 },
    { val: 2, v: 300 },
    { val: 2, v: 400 },
    { val: 5, v: 500 },
    { val: 5, v: 600 },
    { val: 7, v: 700 },
    { val: 8, v: 800 },
    { val: 9, v: 900 },
  ])

  function check(results) {
    var expected = [
      {v: 0, val: 2},
      {v: 500, val: 8.5}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.percentile("v", 500, 0.8)).pipe(concat(check))
})

test("min entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 0}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.min("_t")).pipe(concat(check))
})

test("partial min", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 0},
      {_t: 500, gen: 5},
      {_t: 1000, gen: 10}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.min("_t", 500)).pipe(concat(check))
})

test("max entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 10}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.max("_t")).pipe(concat(check))
})

test("partial max", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 4},
      {_t: 500, gen: 9},
      {_t: 1000, gen: 10}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.max("_t", 500)).pipe(concat(check))
})

test("count entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 11}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.count("_t")).pipe(concat(check))
})

test("partial count", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 5},
      {_t: 500, gen: 5},
      {_t: 1000, gen: 1}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.count("_t", 500)).pipe(concat(check))
})

test("first entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 0}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.first("_t")).pipe(concat(check))
})

test("partial first", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 0},
      {_t: 500, gen: 5},
      {_t: 1000, gen: 10}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.first("_t", 500)).pipe(concat(check))
})

test("last entire series", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [{_t: 0, gen: 10}]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.last("_t")).pipe(concat(check))
})

test("partial last", function (t) {
  t.plan(1)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    var expected = [
      {_t: 0, gen: 4},
      {_t: 500, gen: 9},
      {_t: 1000, gen: 10}
    ]
    t.deepEquals(results, expected, "Got expected results")
  }
  series.pipe(agg.last("_t", 500)).pipe(concat(check))
})

test("sample entire series", function (t) {
  t.plan(2)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    t.equals(results[0]._t, 0, "Has correct timestamp")
    t.ok(results[0].gen >= 0 && results[0].gen <= 10, "Random value is in correct range")
  }
  series.pipe(agg.sample("_t")).pipe(concat(check))
})

test("partial sample", function (t) {
  t.plan(6)

  var series = gen({start: 0, until: 1000, interval: 100})

  function check(results) {
    t.equals(results[0]._t, 0, "Has correct timestamp")
    t.ok(results[0].gen >= 0 && results[0].gen <= 4, "Random value is in correct range")
    t.equals(results[1]._t, 500, "Has correct timestamp")
    t.ok(results[1].gen >= 5 && results[0].gen <= 9, "Random value is in correct range")
    t.equals(results[2]._t, 1000, "Has correct timestamp")
    t.equals(results[2].gen, 10, "Random value is in correct range")
  }
  series.pipe(agg.sample("_t", 500)).pipe(concat(check))
})

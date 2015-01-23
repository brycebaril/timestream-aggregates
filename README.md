timestream-aggregates
=====

[![NPM](https://nodei.co/npm/timestream-aggregates.png)](https://nodei.co/npm/timestream-aggregates/)

Aggregation functions for objectMode streams. Contains a set of stream Transforms that accept objectMode streams with a sequenceKey and aggregate all other values of each record into chunks at regular intervals.

This is most useful for timeseries data as the chunked aggregation function is designed to slice data by time.

The interval slicing function is [floordate](http://npm.im/floordate).

```javascript
var spigot = require("stream-spigot")
var agg = require("timestream-aggregates")
var concat = require("concat-stream")

function series() {
  return spigot({objectMode: true}, [
    {time: 1378511041582, speed: 1, odometer: 0,   fuel: 100},
    {time: 1378511141582, speed: 4, odometer: 11,  fuel: 98},
    {time: 1378511241582, speed: 3, odometer: 22,  fuel: 97},
    {time: 1378511341582, speed: 25, odometer: 99,  fuel: 76},
    {time: 1378511441582, speed: 50, odometer: 155, fuel: 70},
    {time: 1378511541582, speed: 50, odometer: 241, fuel: 62},
    {time: 1378511641582, speed: 122, odometer: 755, fuel: 18},
    {time: 1378511741582, speed: 31, odometer: 780, fuel: 15},
    {time: 1378511841582, speed: 0, odometer: 780, fuel: 15},
  ])
}

series()
  .pipe(agg.sum("time"))
  .pipe(concat(console.log))

/*
[ { time: 0, speed: 286, odometer: 2843, fuel: 551 } ]
*/

series()
  .pipe(agg.sum("time", "hour"))
  .pipe(concat(console.log))

/*
[ { time: 1378508400000, speed: 1, odometer: 0, fuel: 100 },
  { time: 1378512000000, speed: 82, odometer: 287, fuel: 341 },
  { time: 1378515600000, speed: 203, odometer: 1776, fuel: 95 },
  { time: 1378519200000, speed: 0, odometer: 780, fuel: 15 } ]
*/

series()
  .pipe(agg.mean("time", "hour"))
  .pipe(concat(console.log))

/*
[ { time: 1378508400000, speed: 1, odometer: 0, fuel: 100 },
  { time: 1378512000000, speed: 20.5, odometer: 71.75, fuel: 85.25 },
  { time: 1378515600000, speed: 67.66666666666667, odometer: 592, fuel: 31.666666666666668 },
  { time: 1378519200000, speed: 0, odometer: 780, fuel: 15 } ]
*/

```

API
===

All aggregates accept an interval slice that it will partition the streams into. This can either be a raw number, or any of the intervals accepted by [floordate](http://npm.im/floordate):

  * s, sec, secs, second, seconds
  * m, min, mins, minute, minutes
  * h, hr, hrs, hour, hours
  * d, day, days
  * w, wk, wks, week, weeks
  * M, mon, mons, month, months
  * q, qtr, qtrs, quarter, quarters
  * y, yr, yrs, year, years

If no interval is specified, the operation is applied over every record resulting in a single record.

`sum(seqKey [,interval])`
---

Sums all numeric values during each interval by key. Uses the [stats-lite](http://npm.im/stats-lite) library.

`mean(seqKey [,interval])`
---

Averages (mean) all numeric values during each interval by key. Uses the [stats-lite](http://npm.im/stats-lite) library.

`mode(seqKey [,interval])`
---

Averages (mode) all numeric values during each interval by key. Uses the [stats-lite](http://npm.im/stats-lite) library.

`median(seqKey [,interval])`
---

Averages (median) all numeric values during each interval by key. Uses the [stats-lite](http://npm.im/stats-lite) library.

`variance(seqKey [,interval])`
---

Calculates the variance of all numeric values during each interval by key. Uses the [stats-lite](http://npm.im/stats-lite) library.

`stdev(seqKey [,interval])`
---

Calculates the standard deviation of all numeric values during each interval by key. Uses the [stats-lite](http://npm.im/stats-lite) library.

`percentile(seqKey [,interval], percent)`
---

Calculates the specified percentile of all numeric values during each interval by key. Uses the [stats-lite](http://npm.im/stats-lite) library.

`min(seqKey [,interval])`
---

Returns records where each key is the minimum value (Math.min) in each interval by key.

`max(seqKey [,interval])`
---

Returns records where each key is the maximum value (Math.max) in each interval by key.

`count(seqKey [,interval])`
---

Returns records where each key is the number of values in each interval by key.

`first(seqKey [,interval])`
---

Returns records where each key is the first (chronologically) value in each interval by key.

`last(seqKey [,interval])`
---

Returns records where each key is the last (chronologically) value in each interval by key.

`sample(seqKey [,interval])`
---

Returns records where each key a random member of the records in each interval by key.

LICENSE
=======

MIT

var spigot = require("stream-spigot")
var agg = require("../aggregates")
var concat = require("concat-stream")

function series() {
  return spigot({objectMode: true}, [
    {time: 1378511041582, speed: 1, odometer: 0,   fuel: 100},
    {time: 1378512141582, speed: 4, odometer: 11,  fuel: 98},
    {time: 1378513241582, speed: 3, odometer: 22,  fuel: 97},
    {time: 1378514341582, speed: 25, odometer: 99,  fuel: 76},
    {time: 1378515441582, speed: 50, odometer: 155, fuel: 70},
    {time: 1378516541582, speed: 50, odometer: 241, fuel: 62},
    {time: 1378517641582, speed: 122, odometer: 755, fuel: 18},
    {time: 1378518741582, speed: 31, odometer: 780, fuel: 15},
    {time: 1378519841582, speed: 0, odometer: 780, fuel: 15},
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
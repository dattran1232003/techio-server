const { isNil, ifElse, complement } = require('ramda')

const Just = v => ({
  map:     fn => Just(fn(v)),
  flatMap: fn => fn(v),
  inspect: _  => `Just(${v})`,
  unwrap:  _  => v,
}) 

const Nothing = _ => ({
  map:     _ => Nothing(),
  flatMap: _ => Nothing(),
  inspect: _ => `Nothing`,
  unwrap:  _ => null 
})

const isNotNil = complement(isNil)
const maybeOf = {
  of: ifElse(isNotNil, Just, Nothing)
}
exports.Maybe = maybeOf

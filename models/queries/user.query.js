const R = require('ramda')
const { User } = require('../index')

const follow = async (thatPerson, me) => {
  // follow my self
  if (thatPerson.username === me.username) 
    return new Error('Cannot follow you\'re self')

  const findMe          = User.findOne({ username: me.username })
  const findThatPerson  = User.findOne({ username: thatPerson.username })

  const [meInDB, thatPersonInDB] = await Promise.all([findMe, findThatPerson])
  if (!meInDB) return new Error(`Your account ${me.username} not found.`)
  if (!thatPersonInDB) return new Error(`${thatPerson.username} not found.`)

  const isFollowed = 
    // if i followed on that person
    R.includes(thatPerson.username, meInDB.following || []) ||
    // or list Follower of that person including me
    R.includes(meInDB.username, thatPerson.follower || [])

  const toggleFollow = username => isFollowed 
    ? R.pipe(R.filter(u => u !== username)) // if followed, remove 
    : R.pipe(R.append(username), R.dropRepeats) // if not yet, follow

  meInDB.following        = toggleFollow(thatPerson.username)(meInDB.following  || [])
  thatPersonInDB.follower = toggleFollow(me.username)(thatPersonInDB.follower   || [])

  try {
    // resave both person
    await Promise.all([meInDB.save(), thatPersonInDB.save()])
    return !isFollowed
  } catch (e) {
    console.log(e)
    return new Error('Follow Error', e)
  }
}

module.exports = {
  follow
}

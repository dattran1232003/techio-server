const R = require('ramda')
const { User } = require('../index')
const Cache = require('@util/cacheService')

const userCache = new Cache(60 * 60) // cache for 1 hour

const followCacheKey = (follower, onPerson) => `${follower} following ${onPerson}`
const findUser = username => User.findOne({ username })
const findMultiUsers = (...usernames) => {
  const findingUsers = usernames.map(findUser)
  return Promise.all(findingUsers)
}

const isFollowing = async(thatPerson, me) => {
  // follow my self
  if (thatPerson.username === me.username) 
    return new Error('Cannot follow you\'re self')
  
  // find in caching, if not in caching, store it to Caching
  const isFollowing = await userCache.get(followCacheKey(me.username, thatPerson.username), 
    async function store() {
    const meInDB =  await findUser(me.username)
    if (!meInDB) return new Error(`Your account ${me.username} not found.`)

    return R.includes(thatPerson.username, meInDB.following || [])
  })

  return isFollowing
}

const toggleFollow = async (thatPerson, me) => {
  // follow my self
  if (thatPerson.username === me.username) 
    return new Error('Cannot follow you\'re self')

  const [meInDB, thatPersonInDB] = await findMultiUsers(me.username, thatPerson.username)

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
    // store isFollowed to cache
    await userCache.set(followCacheKey(meInDB.username, thatPerson.username), !isFollowed)
    // return for client
    return !isFollowed
  } catch (e) {
    console.log(e)
    return new Error('Follow Error', e)
  }
}

module.exports = {
  isFollowing,
  toggleFollow
}

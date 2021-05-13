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

const isFollowing = async(person, me) => {
  // follow my self
  if (person.username === me.username) 
    return new Error('Cannot follow you\'re self')
  
  // find in caching, if not in caching, store it to Caching
  const isFollowing = await userCache.get(followCacheKey(me.username, person.username), 
    async function store() {
    const meInDB =  await findUser(me.username)
    if (!meInDB) return new Error(`Your account ${me.username} not found.`)

    return R.includes(person.username, meInDB.following || [])
  })

  return isFollowing
}

const toggleFollow = async (person, me) => {
  // follow my self
  if (person.username === me.username) 
    return new Error('Cannot follow your self.')

  const [meInDB, personInDB] = await findMultiUsers(me.username, person.username)

  if (!meInDB) return new Error(`Your account ${me.username} not found.`)
  if (!personInDB) return new Error(`${person.username} not found.`)

  const isFollowed = 
    // if i followed on that person
    R.includes(person.username, meInDB.following || []) ||
    // or list Followers of that person including me
    R.includes(meInDB.username, person.followers || [])

  const toggleFollow = username => isFollowed 
    ? R.pipe(R.filter(u => u !== username)) // if followed, remove 
    : R.pipe(R.append(username), R.dropRepeats) // if not yet, follow

  meInDB.following        = toggleFollow(person.username)(meInDB.following  || [])
  personInDB.followers    = toggleFollow(me.username)(personInDB.followers  || [])
  console.log(person.username, meInDB.following)
  console.log(me.username, personInDB.followers)

  try {
    // resave both person
    await Promise.all([meInDB.save(), personInDB.save()])
    // store isFollowed to cache
    await userCache.set(followCacheKey(meInDB.username, person.username), !isFollowed)
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

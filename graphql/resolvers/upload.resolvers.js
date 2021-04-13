const { User } = require('@db')
const checkAuth = require('@util/check-auth')
const { uploadPhotoCloud, uploadAvatarCloud } = require('@util/cloudUpload')

module.exports = { 
  Query: {
  },
  Mutation: {
    async uploadPhoto(_, { photo }) {
      try {
        const File = await uploadPhotoCloud(photo)
        return File
      } catch (e) {
        console.error(e)
        return e
      }
    }, // end of uploadPhoto
    async uploadAvatar(_, { avatar }, context) {
      const { username } = checkAuth(context)
      try {
        const File = await uploadAvatarCloud(avatar) 
        User.findOneAndUpdate({ username }, { avatarURL: File.url })
        return File
      } catch(e) {
        console.log(e)
        return new Error('Upload avatar errors')
      }
    }, // end of uploadAvatar
  }
}

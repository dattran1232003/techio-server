const { uploadPhotoCloud, uploadAvatarCloud } = require('../../util/cloudUpload')

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
    async uploadAvatar(_, { avatar }) {
      try {
        const File = await uploadAvatarCloud(avatar)
        return File
      } catch (e) {
        console.error(e)
        return e
      }
    }, // end of uploadAvatar
  }
}

const { uploadPhotoCloud } = require('../../util/cloudUpload')

module.exports = { 
  Query: {
  },
  Mutation: {
    async uploadPhoto(_, { photo }) {
      try {
        const File = await uploadPhotoCloud(photo)
        return File
      } catch (e) {
        return e
      }
    }, // end of singleUpload
  }
}

const { includes } = require('ramda')
const cloudinary = require('cloudinary').v2
const { ApolloError } = require('apollo-server')

const isType = type => includes(type)
const isImage = isType('image/')

const uploadPhotoCloud = (file, dir='/in-post') => 
  new Promise((resolve, reject) => {
    file.then(({ createReadStream, filename, mimetype, encoding }) => {
      if (isImage(mimetype)) { 
        createReadStream()
          .pipe(cloudinary.uploader.upload_stream(
            {
              use_filename: true,
              unique_filename: true,
              resource_type: 'image',
              folder: `/techio/images${dir}`,
            },
            (err, result) => err 
            ? reject(err) 
            : resolve({ ...result, filename, mimetype,encoding })
          ))
      } else { // not is image type
        reject(new ApolloError('File must be image', 'BAD_USER_INPUT'))
      }
    })
  })

module.exports = { uploadPhotoCloud }
